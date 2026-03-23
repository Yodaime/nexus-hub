import { useState, useEffect } from "react";
import { AuthUser, authService } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obter usuário atual inicialmente
    const initializeAuth = async () => {
      try {
        console.log("🔄 Inicializando autenticação...");
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          console.log("✅ Usuário encontrado:", authUser.email);
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } else {
          console.log("❌ Nenhum usuário autenticado");
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao inicializar auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Observar mudanças de autenticação em tempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth state changed:", event);
      if (session?.user) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error("Erro ao obter usuário após auth change:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}
