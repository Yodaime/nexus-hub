import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { Task } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { deleteTask, updateTask } = useTaskStore();

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  const statusLabels = {
    pending: 'Pendente',
    'in-progress': 'Em Andamento',
    completed: 'Concluída',
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const handleStatusChange = () => {
    const statusOrder: Task['status'][] = ['pending', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateTask(task.id, { status: nextStatus });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'glass-card-hover rounded-xl p-4 group',
        isOverdue && 'border-destructive/30'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleStatusChange}
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                task.status === 'completed'
                  ? 'bg-success border-success'
                  : task.status === 'in-progress'
                  ? 'border-primary bg-primary/20'
                  : 'border-muted-foreground hover:border-primary'
              )}
            >
              {task.status === 'completed' && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 text-success-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              )}
            </button>
            <h3
              className={cn(
                'font-semibold truncate',
                task.status === 'completed' && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'px-2 py-1 rounded-md text-xs font-medium',
                `priority-${task.priority}`
              )}
            >
              {priorityLabels[task.priority]}
            </span>

            <span
              className={cn(
                'px-2 py-1 rounded-md text-xs font-medium',
                `status-${task.status.replace('-', '-')}`
              )}
            >
              {statusLabels[task.status]}
            </span>

            <span
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md text-xs',
                'bg-muted text-muted-foreground',
                isOverdue && 'bg-destructive/20 text-destructive'
              )}
            >
              <Calendar className="w-3 h-3" />
              {format(new Date(task.dueDate), "dd MMM", { locale: ptBR })}
            </span>
          </div>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(task)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
