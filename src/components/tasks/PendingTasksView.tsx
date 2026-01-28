import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, Plus } from 'lucide-react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';

interface PendingTasksViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onAddNew: () => void;
}

export function PendingTasksView({ tasks, onEdit, onAddNew }: PendingTasksViewProps) {
  const pendingTasks = tasks.filter(
    (task) => task.status === 'pending' || task.status === 'in-progress'
  );

  if (pendingTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <ListTodo className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhuma tarefa pendente
        </h3>
        <p className="text-muted-foreground mb-4">
          Todas as tarefas foram concluídas!
        </p>
        <Button variant="outline" onClick={onAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Criar nova tarefa
        </Button>
      </motion.div>
    );
  }

  // Separate by status
  const inProgressTasks = pendingTasks.filter((t) => t.status === 'in-progress');
  const waitingTasks = pendingTasks.filter((t) => t.status === 'pending');

  return (
    <div className="space-y-6">
      {/* In Progress */}
      {inProgressTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="font-semibold text-foreground">
              Em Andamento ({inProgressTasks.length})
            </h3>
          </div>
          <AnimatePresence mode="popLayout">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Waiting */}
      {waitingTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <h3 className="font-semibold text-foreground">
              Aguardando ({waitingTasks.length})
            </h3>
          </div>
          <AnimatePresence mode="popLayout">
            {waitingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
