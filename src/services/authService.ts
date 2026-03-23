import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

export const authService = {
  // Registrar novo usuário
  async signup(email: string, password: string, fullName?: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Criar registro do usuário na tabela public.users
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
        });

        if (userError) {
          console.error("Erro ao inserir usuário na tabela:", userError);
          // Se a tabela não existe, informar ao usuário
          if (userError.message?.includes("does not exist")) {
            throw new Error(
              "⚠️ Erro: Banco de dados não está configurado. Execute o SQL em Supabase primeiro (SQL_SETUP_REQUIRED.md)"
            );
          }
          throw userError;
        }
      }

      toast.success("Usuário registrado com sucesso!");
      return authData.user;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao registrar";
      console.error("Erro no signup:", message);
      toast.error(message);
      throw error;
    }
  },

  // Login
  async login(email: string, password: string) {
    try {
      console.log("🔐 Tentando fazer login com:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Erro de login:", error);
        // Verificar se é um erro comum
        if (error.message?.includes("Invalid login")) {
          throw new Error("Email ou senha incorretos");
        }
        if (error.message?.includes("User not found")) {
          throw new Error("Usuário não encontrado. Registre-se primeiro!");
        }
        throw error;
      }

      console.log("✅ Login realizado com sucesso!");
      toast.success("Login realizado com sucesso!");
      return data.user;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao fazer login";
      console.error("Erro no login:", message);
      toast.error(message);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Logout realizado!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao fazer logout";
      toast.error(message);
      throw error;
    }
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      // Tentar buscar dados completos do usuário
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          return {
            id: data.id,
            email: data.email,
            full_name: data.full_name,
          };
        }
      } catch (error) {
        console.log("Usuário não encontrado na tabela users, usando dados do Auth");
      }

      // Se não encontrar na tabela, retornar dados do Auth
      return {
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name,
      };
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error);
      return null;
    }
  },

  // Recuperação de senha
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Link de recuperação enviado para seu email!");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao recuperar senha";
      toast.error(message);
      throw error;
    }
  },

  // Atualizar perfil
  async updateProfile(updates: { full_name?: string }) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar perfil";
      toast.error(message);
      throw error;
    }
  },

  // Observar mudanças de autenticação
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name,
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};
