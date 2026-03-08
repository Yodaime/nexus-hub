import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Target, Flame, CheckCircle2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  useHabitStore,
  DayOfWeek,
  dayLabels,
  allDays,
} from '@/stores/habitStore';

function getDayOfWeekFromDate(date: Date): DayOfWeek {
  const map: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return map[date.getDay()];
}

function getDateForDayInCurrentWeek(day: DayOfWeek): string {
  const now = new Date();
  const currentDayIndex = now.getDay(); // 0=Sun
  const targetIndex = allDays.indexOf(day) + 1; // 1=Mon
  const adjustedTarget = targetIndex === 7 ? 0 : targetIndex;
  const diff = adjustedTarget - currentDayIndex;
  const target = new Date(now);
  target.setDate(now.getDate() + diff);
  return target.toISOString().split('T')[0];
}

export default function HabitsPage() {
  const today = new Date();
  const todayDay = getDayOfWeekFromDate(today);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDay);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [selectedDaysForNew, setSelectedDaysForNew] = useState<DayOfWeek[]>([todayDay]);
  const [showAddForm, setShowAddForm] = useState(false);

  const { getHabitsForDay, toggleCompletion, isCompleted, addHabit, removeHabit } = useHabitStore();

  const habits = getHabitsForDay(selectedDay);
  const dateStr = getDateForDayInCurrentWeek(selectedDay);

  const completedCount = habits.filter((h) => isCompleted(h.id, dateStr)).length;
  const progress = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const handleAddHabit = () => {
    if (!newHabitTitle.trim() || selectedDaysForNew.length === 0) return;
    addHabit(newHabitTitle.trim(), selectedDaysForNew);
    setNewHabitTitle('');
    setSelectedDaysForNew([todayDay]);
    setShowAddForm(false);
  };

  const toggleDayForNew = (day: DayOfWeek) => {
    setSelectedDaysForNew((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Hábitos</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Acompanhe seus hábitos diários
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Hábito
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="p-4 text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{habits.length}</p>
            <p className="text-xs text-muted-foreground">Hábitos</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Concluídos</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Flame className="w-5 h-5 text-warning mx-auto mb-1" />
            <p className="text-2xl font-bold">{progress}%</p>
            <p className="text-xs text-muted-foreground">Progresso</p>
          </GlassCard>
        </div>

        {/* Day filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {allDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                selectedDay === day
                  ? 'bg-primary text-primary-foreground shadow-lg neon-glow-primary'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {dayLabels[day].slice(0, 3)}
              {day === todayDay && (
                <span className="ml-1 text-[10px] opacity-70">•</span>
              )}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{dayLabels[selectedDay]}</span>
            <span className="text-sm text-muted-foreground">{completedCount}/{habits.length}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </GlassCard>

        {/* Add habit form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="p-5 space-y-4">
                <h3 className="font-semibold">Novo Hábito</h3>
                <Input
                  placeholder="Ex: Tomar água ao acordar"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="bg-muted/50 border-border"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Dias da semana:</p>
                  <div className="flex flex-wrap gap-2">
                    {allDays.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDayForNew(day)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                          selectedDaysForNew.includes(day)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        {dayLabels[day].slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAddForm(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleAddHabit}>
                    Adicionar
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habits list */}
        <div className="space-y-3">
          {habits.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Nenhum hábito para {dayLabels[selectedDay].toLowerCase()}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar hábito
              </Button>
            </GlassCard>
          ) : (
            habits.map((habit, index) => {
              const completed = isCompleted(habit.id, dateStr);
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={cn(
                      'glass-card rounded-xl p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer',
                      completed && 'border-success/30'
                    )}
                    onClick={() => toggleCompletion(habit.id, dateStr)}
                  >
                    <Checkbox
                      checked={completed}
                      onCheckedChange={() => toggleCompletion(habit.id, dateStr)}
                      className={cn(
                        'h-5 w-5 rounded-md border-2 transition-all',
                        completed
                          ? 'border-success bg-success data-[state=checked]:bg-success data-[state=checked]:border-success'
                          : 'border-muted-foreground'
                      )}
                    />
                    <span
                      className={cn(
                        'flex-1 text-sm font-medium transition-all',
                        completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {habit.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHabit(habit.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </GlassCard>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}
