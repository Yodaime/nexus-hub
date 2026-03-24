import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser, authService } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Inicializar autenticação apenas uma vez
    const initializeAuth = async () => {
      try {
        console.log("🔄 [AuthContext] Inicializando autenticação...");
        
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          console.log("✅ [AuthContext] Usuário encontrado:", authUser.email);
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } else {
          console.log("❌ [AuthContext] Nenhum usuário autenticado");
          setUser(null);
        }
      } catch (error) {
        console.error("[AuthContext] Erro ao inicializar auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    // Observar mudanças de autenticação em tempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 [AuthContext] Auth state changed:", event);
      if (session?.user) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error("[AuthContext] Erro ao obter usuário após auth change:", error);
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

  return (
    <AuthContext.Provider value={{ user, loading, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  }
  return context;
}
