import { motion } from 'framer-motion';
import { Edit2, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Goal } from '@/types';
import { Button } from '@/components/ui/button';
import { useGoalStore } from '@/stores/goalStore';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
}

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const { deleteGoal, moveGoal } = useGoalStore();

  const statusIcons = {
    'not-started': <AlertCircle className="h-4 w-4" />,
    'in-progress': <Clock className="h-4 w-4" />,
    'completed': <CheckCircle2 className="h-4 w-4" />,
  };

  const statusColors = {
    'not-started': 'bg-muted text-muted-foreground',
    'in-progress': 'bg-blue-500/20 text-blue-500',
    'completed': 'bg-green-500/20 text-green-500',
  };

  const statusLabels = {
    'not-started': 'Não iniciado',
    'in-progress': 'Em progresso',
    'completed': 'Concluído',
  };

  const frequencyLabels = {
    'daily': 'Diária',
    'weekly': 'Semanal',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-secondary/10 to-primary/5 border border-secondary/20 rounded-lg p-4 space-y-3 hover:border-secondary/40 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
          )}
        </div>
        <span className={cn('text-xs px-2 py-1 rounded-full', statusColors[goal.status])}>
          {statusLabels[goal.status]}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {goal.category && (
          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
            {goal.category}
          </span>
        )}
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
          {frequencyLabels[goal.frequency]}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Progresso</span>
          <span className="text-xs font-semibold text-secondary">{goal.progress}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(goal)}
        >
          <Edit2 className="h-3 w-3 mr-1" />
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive"
          onClick={() => deleteGoal(goal.id)}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Deletar
        </Button>
      </div>

      {/* Status Change Buttons */}
      <div className="flex gap-1 pt-2 border-t border-secondary/10">
        {(['not-started', 'in-progress', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => moveGoal(goal.id, status)}
            className={cn(
              'flex-1 text-xs py-1 px-2 rounded transition-colors',
              goal.status === status
                ? 'bg-secondary/40 text-secondary font-semibold'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            )}
          >
            {statusIcons[status]}
            <span className="ml-1 hidden sm:inline">{statusLabels[status].split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
