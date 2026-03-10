import { useState, useMemo } from 'react';
import { Plus, Bell, BellRing, Clock, CheckCircle2, Trash2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useReminderStore } from '@/stores/reminderStore';

export default function RemindersPage() {
  const { reminders, addReminder, toggleComplete, deleteReminder } = useReminderStore();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');

  const stats = useMemo(() => {
    const now = new Date();
    const active = reminders.filter(r => !r.completed).length;
    const completed = reminders.filter(r => r.completed).length;
    const upcoming = reminders.filter(r => !r.completed && new Date(r.dateTime) > now).length;
    const overdue = reminders.filter(r => !r.completed && new Date(r.dateTime) <= now).length;
    return { active, completed, upcoming, overdue };
  }, [reminders]);

  const handleAdd = () => {
    if (!title.trim() || !dateTime) {
      toast.error('Preencha o título e a data/hora.');
      return;
    }
    addReminder({
      title: title.trim(),
      description: description.trim(),
      dateTime,
    });
    setTitle('');
    setDescription('');
    setDateTime('');
    setIsAdding(false);
    toast.success('Lembrete criado!');
  };

  const handleDelete = (id: string) => {
    deleteReminder(id);
    toast.success('Lembrete removido.');
  };

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
  }, [reminders]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold neon-text-primary">Lembretes</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Nunca esqueça de algo importante
            </p>
          </div>
          <Button variant="neon" onClick={() => setIsAdding(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Novo Lembrete
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <StatCard title="Ativos" value={stats.active} icon={<Bell className="w-5 h-5" />} variant="primary" />
          <StatCard title="Próximos" value={stats.upcoming} icon={<Clock className="w-5 h-5" />} variant="default" />
          <StatCard title="Atrasados" value={stats.overdue} icon={<BellRing className="w-5 h-5" />} variant="destructive" />
          <StatCard title="Concluídos" value={stats.completed} icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GlassCard className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Novo Lembrete</h3>
                <Input
                  placeholder="Título do lembrete"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="bg-muted/50"
                />
                <Textarea
                  placeholder="Descrição (opcional)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="bg-muted/50"
                  rows={2}
                />
                <Input
                  type="datetime-local"
                  value={dateTime}
                  onChange={e => setDateTime(e.target.value)}
                  className="bg-muted/50"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
                  <Button variant="neon" onClick={handleAdd}>Salvar</Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reminders List */}
        <div className="space-y-4">
          {sortedReminders.length === 0 && !isAdding && (
            <GlassCard className="p-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum lembrete ainda.</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Crie seu primeiro lembrete!</p>
            </GlassCard>
          )}

          {/* Active Reminders */}
          {sortedReminders.filter(r => !r.completed).length > 0 && (
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center gap-2 w-full mb-3">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Ativos</h3>
                <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground">
                  {sortedReminders.filter(r => !r.completed).length}
                </span>
                <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {sortedReminders.filter(r => !r.completed).map(reminder => {
                      const isOverdue = new Date(reminder.dateTime) <= new Date();
                      return (
                        <motion.div key={reminder.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} layout>
                          <GlassCard className={`p-4 flex items-start gap-4 ${isOverdue ? 'border-destructive/30' : ''}`}>
                            <button onClick={() => toggleComplete(reminder.id)} className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isOverdue ? 'border-destructive' : 'border-primary'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{reminder.title}</p>
                              {reminder.description && <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>}
                              <p className={`text-xs mt-2 flex items-center gap-1 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                                <Clock className="w-3 h-3" />
                                {format(new Date(reminder.dateTime), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                {isOverdue && <span className="ml-1 font-medium">(Atrasado)</span>}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(reminder.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Completed Reminders */}
          {sortedReminders.filter(r => r.completed).length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 w-full mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold text-sm">Concluídos</h3>
                <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground">
                  {sortedReminders.filter(r => r.completed).length}
                </span>
                <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {sortedReminders.filter(r => r.completed).map(reminder => (
                      <motion.div key={reminder.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} layout>
                        <GlassCard className="p-4 flex items-start gap-4 opacity-50">
                          <button onClick={() => toggleComplete(reminder.id)} className="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 bg-green-500 border-green-500">
                            <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium line-through text-muted-foreground">{reminder.title}</p>
                            {reminder.description && <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>}
                            <p className="text-xs mt-2 flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {format(new Date(reminder.dateTime), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(reminder.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
