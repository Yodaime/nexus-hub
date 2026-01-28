import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Flame, AlertCircle } from 'lucide-react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UrgentTasksViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const priorityConfig = {
  high: {
    label: 'Alta Prioridade',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    badgeVariant: 'destructive' as const,
  },
  medium: {
    label: 'Média Prioridade',
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    badgeVariant: 'outline' as const,
  },
  low: {
    label: 'Baixa Prioridade',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badgeVariant: 'secondary' as const,
  },
};

export function UrgentTasksView({ tasks, onEdit }: UrgentTasksViewProps) {
  // Filter urgent tasks (overdue or due within 2 days)
  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  const urgentTasks = tasks.filter((task) => {
    if (task.status === 'completed') return false;
    const dueDate = new Date(task.dueDate);
    return dueDate <= twoDaysFromNow;
  });

  // Group by priority
  const tasksByPriority = {
    high: urgentTasks.filter((t) => t.priority === 'high'),
    medium: urgentTasks.filter((t) => t.priority === 'medium'),
    low: urgentTasks.filter((t) => t.priority === 'low'),
  };

  const overdueTasks = urgentTasks.filter(
    (t) => new Date(t.dueDate) < now
  );

  if (urgentTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhuma tarefa urgente!
        </h3>
        <p className="text-muted-foreground">
          Você está em dia com suas tarefas. Continue assim! 🎉
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgent Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{urgentTasks.length}</p>
              <p className="text-xs text-muted-foreground">Urgentes</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{overdueTasks.length}</p>
              <p className="text-xs text-muted-foreground">Atrasadas</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{tasksByPriority.high.length}</p>
              <p className="text-xs text-muted-foreground">Alta Prioridade</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{tasksByPriority.medium.length}</p>
              <p className="text-xs text-muted-foreground">Média Prioridade</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Priority Sections */}
      {(['high', 'medium', 'low'] as const).map((priority) => {
        const config = priorityConfig[priority];
        const priorityTasks = tasksByPriority[priority];

        if (priorityTasks.length === 0) return null;

        return (
          <motion.div
            key={priority}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className={cn(
              'flex items-center gap-3 p-3 rounded-lg border',
              config.bgColor,
              config.borderColor
            )}>
              <config.icon className={cn('w-5 h-5', config.color)} />
              <h3 className={cn('font-semibold', config.color)}>
                {config.label}
              </h3>
              <Badge variant={config.badgeVariant} className="ml-auto">
                {priorityTasks.length} {priorityTasks.length === 1 ? 'tarefa' : 'tarefas'}
              </Badge>
            </div>

            <div className="space-y-2 pl-4 border-l-2 border-muted">
              {priorityTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEdit} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
