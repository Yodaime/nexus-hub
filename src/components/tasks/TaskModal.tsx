import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Flag, Mic, MicOff } from 'lucide-react';
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
import { Task, TaskPriority, TaskStatus } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { addTask, updateTask } = useTaskStore();
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    priority: task?.priority || 'medium' as TaskPriority,
    status: task?.status || 'pending' as TaskStatus,
    tags: task?.tags.join(', ') || '',
  });

  const [isRecordingTitle, setIsRecordingTitle] = useState(false);
  const [isRecordingDescription, setIsRecordingDescription] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        tags: task.tags?.join(', ') || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        tags: '',
      });
    }
  }, [task]);

  const startRecording = (field: 'title' | 'description') => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      toast.error('Seu navegador não suporta reconhecimento de voz');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      if (field === 'title') {
        setIsRecordingTitle(true);
      } else {
        setIsRecordingDescription(true);
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setFormData(prev => ({
          ...prev,
          [field]: prev[field] + (prev[field] ? ' ' : '') + finalTranscript
        }));
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Erro no reconhecimento de voz');
      stopRecording(field);
    };

    recognition.onend = () => {
      if (field === 'title') {
        setIsRecordingTitle(false);
      } else {
        setIsRecordingDescription(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = (field: 'title' | 'description') => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (field === 'title') {
      setIsRecordingTitle(false);
    } else {
      setIsRecordingDescription(false);
    }
  };

  const toggleRecording = (field: 'title' | 'description') => {
    const isRecording = field === 'title' ? isRecordingTitle : isRecordingDescription;
    if (isRecording) {
      stopRecording(field);
    } else {
      startRecording(field);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title: formData.title,
      description: formData.description,
      dueDate: new Date(formData.dueDate).toISOString(),
      priority: formData.priority,
      status: formData.status,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (isEditing && task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      tags: '',
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-2xl p-6 border border-primary/20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <div className="relative flex gap-2">
                    <Input
                      id="title"
                      placeholder="Nome da tarefa"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="bg-muted/50 border-border focus:border-primary flex-1"
                    />
                    <Button
                      type="button"
                      variant={isRecordingTitle ? "destructive" : "outline"}
                      size="icon"
                      onClick={() => toggleRecording('title')}
                      className={cn(
                        "shrink-0 transition-all",
                        isRecordingTitle && "animate-pulse bg-destructive"
                      )}
                    >
                      {isRecordingTitle ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {isRecordingTitle && (
                    <p className="text-xs text-destructive animate-pulse">
                      🎤 Gravando... Fale agora
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <div className="relative flex gap-2">
                    <Textarea
                      id="description"
                      placeholder="Detalhes da tarefa..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="bg-muted/50 border-border focus:border-primary min-h-[80px] flex-1"
                    />
                    <Button
                      type="button"
                      variant={isRecordingDescription ? "destructive" : "outline"}
                      size="icon"
                      onClick={() => toggleRecording('description')}
                      className={cn(
                        "shrink-0 self-start transition-all",
                        isRecordingDescription && "animate-pulse bg-destructive"
                      )}
                    >
                      {isRecordingDescription ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {isRecordingDescription && (
                    <p className="text-xs text-destructive animate-pulse">
                      🎤 Gravando... Fale agora
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Data de Vencimento
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      required
                      className="bg-muted/50 border-border focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-secondary" />
                      Prioridade
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: TaskPriority) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger className="bg-muted/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Baixa</SelectItem>
                        <SelectItem value="medium">🟡 Média</SelectItem>
                        <SelectItem value="high">🔴 Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: TaskStatus) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-muted/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">⏳ Pendente</SelectItem>
                      <SelectItem value="in-progress">🔄 Em Andamento</SelectItem>
                      <SelectItem value="completed">✅ Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Tags (separadas por vírgula)
                  </Label>
                  <Input
                    id="tags"
                    placeholder="design, frontend, urgente"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="bg-muted/50 border-border focus:border-primary"
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
                  <Button type="submit" variant="neon" className="flex-1">
                    {isEditing ? 'Salvar' : 'Criar Tarefa'}
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
