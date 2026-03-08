import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Calendar, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Goal, GoalFrequency, GoalStatus } from '@/types';
import { useGoalStore } from '@/stores/goalStore';
import { cn } from '@/lib/utils';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal | null;
}

export function GoalModal({ isOpen, onClose, goal }: GoalModalProps) {
  const { addGoal, updateGoal } = useGoalStore();
  const isEditing = !!goal;

  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    frequency: goal?.frequency || 'daily' as GoalFrequency,
    category: goal?.category || '',
    progress: goal?.progress || 0,
    dueDate: goal?.dueDate ? new Date(goal.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goalData = {
      title: formData.title,
      description: formData.description,
      frequency: formData.frequency,
      status: goal?.status || 'not-started' as GoalStatus,
      dueDate: new Date(formData.dueDate).toISOString(),
      progress: formData.progress,
      category: formData.category,
    };

    if (isEditing && goal) {
      updateGoal(goal.id, goalData);
    } else {
      addGoal(goalData);
    }

    onClose();
    setFormData({
      title: '',
      description: '',
      frequency: 'daily',
      category: '',
      progress: 0,
      dueDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
         
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4"
          >
            <div className="glass-card rounded-2xl p-6 border border-secondary/20 mx-auto max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Editar Meta' : 'Nova Meta'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-secondary" />
                    Título
                  </Label>
                  <Input
                    id="title"
                    placeholder="Digite o título da meta"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="bg-muted/50 border-border focus:border-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-secondary" />
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva sua meta..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-muted/50 border-border focus:border-secondary min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) =>
                        setFormData({ ...formData, frequency: value as GoalFrequency })
                      }
                    >
                      <SelectTrigger className="bg-muted/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diária</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      placeholder="Ex: Saúde"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="bg-muted/50 border-border focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                    Data de Vencimento
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    required
                    className="bg-muted/50 border-border focus:border-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progress" className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-secondary" />
                    Progresso: {formData.progress}%
                  </Label>
                  <input
                    id="progress"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({ ...formData, progress: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    {isEditing ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
