import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, Clock, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ptBR } from 'date-fns/locale';

import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskModal } from '@/components/tasks/TaskModal';
import { useTaskStore } from '@/stores/taskStore';
import { Task, TaskStatus } from '@/types';

const columns: { id: TaskStatus; title: string; icon: React.ReactNode; colorClass: string }[] = [
  {
    id: 'pending',
    title: 'Pendentes',
    icon: <Clock className="w-4 h-4" />,
    colorClass: 'text-muted-foreground border-muted-foreground/30',
  },
  {
    id: 'in-progress',
    title: 'Em Andamento',
    icon: <AlertTriangle className="w-4 h-4" />,
    colorClass: 'text-primary border-primary/30',
  },
  {
    id: 'completed',
    title: 'Concluídas',
    icon: <CheckCircle2 className="w-4 h-4" />,
    colorClass: 'text-green-500 border-green-500/30',
  },
];

const priorityStyles: Record<string, string> = {
  high: 'bg-destructive/20 text-destructive border-destructive/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const priorityLabels: Record<string, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};

export default function OrganizePage() {
  const { tasks, updateTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      pending: [],
      'in-progress': [],
      completed: [],
    };
    tasks.forEach((t) => grouped[t.status]?.push(t));
    return grouped;
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedTask && draggedTask.status !== status) {
      updateTask(draggedTask.id, { status });
    }
    setDraggedTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleMoveTask = (task: Task, newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold neon-text-primary">Organizar</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Arraste e solte para organizar suas tarefas no Kanban
            </p>
          </div>
          <Button variant="neon" onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex flex-col"
            >
              <GlassCard
                className={`p-4 flex-1 transition-all duration-200 ${
                  dragOverColumn === col.id ? 'ring-2 ring-primary/50 scale-[1.01]' : ''
                }`}
              >
                {/* Column Header */}
                <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${col.colorClass}`}>
                  {col.icon}
                  <h3 className="font-semibold text-sm">{col.title}</h3>
                  <span className="ml-auto text-xs bg-muted/50 px-2 py-0.5 rounded-full">
                    {tasksByStatus[col.id].length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 min-h-[120px]">
                  <AnimatePresence mode="popLayout">
                    {tasksByStatus[col.id].map((task) => (
                      <KanbanCard
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                        onDragStart={handleDragStart}
                        onMove={handleMoveTask}
                        isDragged={draggedTask?.id === task.id}
                        columns={columns}
                        currentStatus={col.id}
                      />
                    ))}
                  </AnimatePresence>

                  {tasksByStatus[col.id].length === 0 && (
                    <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted/30 rounded-xl">
                      <p className="text-xs text-muted-foreground">
                        Arraste tarefas aqui
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} task={editingTask} />
    </MainLayout>
  );
}

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onMove: (task: Task, status: TaskStatus) => void;
  isDragged: boolean;
  columns: typeof columns;
  currentStatus: TaskStatus;
}

function KanbanCard({ task, onEdit, onDragStart, onMove, isDragged, columns, currentStatus }: KanbanCardProps) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragged ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, task)}
      onClick={() => onEdit(task)}
      className="group cursor-grab active:cursor-grabbing bg-card/60 hover:bg-card/80 border border-border/50 hover:border-primary/30 rounded-xl p-3 transition-all duration-200"
    >
      {/* Drag handle + Priority */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityStyles[task.priority]}`}>
            {priorityLabels[task.priority]}
          </Badge>
        </div>
        {isOverdue && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-destructive/20 text-destructive border-destructive/30">
            Atrasada
          </Badge>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-foreground mb-1 line-clamp-2">{task.title}</h4>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
        <span className={`text-[10px] ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
          {format(new Date(task.dueDate), "dd MMM", { locale: ptBR })}
        </span>

        {/* Quick move buttons (mobile friendly) */}
        <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          {columns
            .filter((c) => c.id !== currentStatus)
            .map((c) => (
              <button
                key={c.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task, c.id);
                }}
                className={`p-1 rounded-md hover:bg-muted/50 ${c.colorClass}`}
                title={`Mover para ${c.title}`}
              >
                {c.icon}
              </button>
            ))}
        </div>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] bg-muted/40 text-muted-foreground px-1.5 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
