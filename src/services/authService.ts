import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { initializeUserData } from "./dataService";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

const db = supabase as any;

export const authService = {
  async signup(email: string, password: string, fullName?: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (authError) throw authError;

      if (authData.user) {
        const { error: userError } = await db.from("users").insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
        });
        if (userError) {
          console.error("Erro ao inserir usuário na tabela:", userError);
          throw userError;
        }
        console.log('[signup] Inicializando dados para o usuário:', authData.user.id);
        await initializeUserData(authData.user.id);
      }
      toast.success("Usuário registrado com sucesso!");
      return authData.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao registrar";
      console.error("Erro no signup:", message);
      toast.error(message);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message?.includes("Invalid login")) throw new Error("Email ou senha incorretos");
        if (error.message?.includes("User not found")) throw new Error("Usuário não encontrado. Registre-se primeiro!");
        throw error;
      }
      toast.success("Login realizado com sucesso!");
      return data.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao fazer login";
      toast.error(message);
      throw error;
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logout realizado!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao fazer logout";
      toast.error(message);
      throw error;
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      try {
        const { data } = await db.from("users").select("*").eq("id", user.id).single();
        if (data) {
          return { id: data.id, email: data.email, full_name: data.full_name };
        }
      } catch (error) {
        console.log("Usuário não encontrado na tabela users, usando dados do Auth", error);
      }

      return {
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || "",
      };
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error);
      return null;
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Link de recuperação enviado para seu email!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao recuperar senha";
      toast.error(message);
      throw error;
    }
  },

  async updateProfile(updates: { full_name?: string }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { error } = await db.from("users").update(updates).eq("id", user.id);
      if (error) throw error;
      toast.success("Perfil atualizado!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar perfil";
      toast.error(message);
      throw error;
    }
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name,
        });
      } else {
        callback(null);
      }
    });
  },
};
