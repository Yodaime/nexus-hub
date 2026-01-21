import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'primary' | 'secondary' | 'none';
}

export function GlassCard({ 
  children, 
  className, 
  hover = false,
  glow = 'none' 
}: GlassCardProps) {
  const glowClass = {
    primary: 'neon-glow-primary',
    secondary: 'neon-glow-secondary',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        hover ? 'glass-card-hover' : 'glass-card',
        glowClass[glow],
        'rounded-xl p-6',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
