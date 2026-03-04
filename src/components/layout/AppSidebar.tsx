import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Wallet,
  Bell,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { title: 'Tarefas', icon: CheckSquare, path: '/' },
  { title: 'Finanças', icon: Wallet, path: '/finances' },
  { title: 'Lembretes', icon: Bell, path: '/reminders' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Sidebar - Desktop only */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 0 : 280,
          x: collapsed ? -280 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'hidden lg:flex fixed left-0 top-0 h-screen z-50',
          'bg-sidebar border-r border-sidebar-border',
          'flex-col',
          'lg:relative lg:translate-x-0',
          collapsed ? 'lg:w-0' : 'lg:w-[280px]'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground">NexusHub</span>
            <span className="text-xs text-muted-foreground">Produtividade</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
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
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>
    </>
  );
}
