import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Wallet,
  Bell,
  LayoutGrid,
  Menu,
  X,
  Sparkles,
  Repeat,
  Target,
  LogOut,
  Apple,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';

const navItems = [
  { title: 'Geral', icon: LayoutGrid, path: '/' },
  { title: 'Tarefas', icon: CheckSquare, path: '/tasks' },
  { title: 'Finanças', icon: Wallet, path: '/finances' },
  { title: 'Hábitos', icon: Repeat, path: '/habits' },
  { title: 'Lembretes', icon: Bell, path: '/reminders' },
  { title: 'Metas', icon: Target, path: '/goals' },
  { title: 'Aprendizado', icon: Sparkles, path: '/learning' },
  { title: 'Nutri', icon: Apple, path: '/nutri' },
  { title: 'Sono e Humor', icon: Moon, path: '/mood' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Auto-close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {/* Backdrop - Mobile only */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>
      {/* Sidebar - Visible on all devices */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 0 : 280,
          x: collapsed ? -280 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'flex fixed left-0 top-0 h-screen z-50',
          'bg-sidebar border-r border-sidebar-border',
          'flex-col',
          'lg:relative lg:translate-x-0',
          collapsed ? 'w-0' : 'w-[280px]'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">NexusHub</span>
              <span className="text-xs text-muted-foreground">Produtividade</span>
            </div>
          </div>
          {/* Close Button - Mobile and Desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={() => setCollapsed(true)}
            title="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  'text-sidebar-foreground hover:bg-sidebar-accent',
                  isActive && 'bg-primary/10 text-primary border border-primary/20'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                <span className="font-medium">{item.title}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-primary"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Dica do dia</p>
            <p className="text-sm text-foreground">
              Organize suas tarefas por prioridade para melhor produtividade! 🚀
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Desktop toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 z-40 transition-all duration-300 hidden lg:flex"
        style={{ left: collapsed ? 16 : 296 }}
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Abrir menu' : 'Fechar menu'}
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      {/* Mobile toggle - visible when sidebar is collapsed */}
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 left-4 z-40 lg:hidden shadow-lg bg-primary hover:bg-primary/80"
          onClick={() => setCollapsed(false)}
          title="Abrir menu"
        >
          <Menu className="h-5 w-5 text-primary-foreground" />
        </Button>
      )}
    </>
  );
}
