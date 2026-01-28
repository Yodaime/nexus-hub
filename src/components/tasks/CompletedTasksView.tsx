import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trophy, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/stores/taskStore';

interface CompletedTasksViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

export function CompletedTasksView({ tasks, onEdit }: CompletedTasksViewProps) {
  const { deleteTask } = useTaskStore();
  
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  // Group by completion date
  const groupedByDate = completedTasks.reduce((acc, task) => {
    const dateKey = format(new Date(task.updatedAt), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleClearCompleted = () => {
    completedTasks.forEach((task) => deleteTask(task.id));
  };

  if (completedTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhuma tarefa concluída
        </h3>
        <p className="text-muted-foreground">
          Complete algumas tarefas para vê-las aqui!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Trophy className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {completedTasks.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {completedTasks.length === 1 ? 'Tarefa concluída' : 'Tarefas concluídas'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCompleted}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>
      </GlassCard>

      {/* Grouped by date */}
      {sortedDates.map((dateKey) => {
        const dateTasks = groupedByDate[dateKey];
        const formattedDate = format(new Date(dateKey), "EEEE, d 'de' MMMM", {
          locale: ptBR,
        });

        return (
          <div key={dateKey} className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <h3 className="font-medium text-muted-foreground capitalize">
                {formattedDate}
              </h3>
              <span className="text-xs text-muted-foreground">
                ({dateTasks.length})
              </span>
            </div>
            <AnimatePresence mode="popLayout">
              {dateTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEdit} />
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
