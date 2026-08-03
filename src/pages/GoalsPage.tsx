import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Flame, CheckCircle2, Edit2, Trash2, CalendarDays } from 'lucide-react';

import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GoalModal } from '@/components/goals/GoalModal';
import { useGoalStore } from '@/stores/goalStore';
import { Goal, GoalFrequency } from '@/types';
import { cn } from '@/lib/utils';

/** Converte uma data para o formato YYYY-MM-DD (local) */
function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Retorna todos os dias do mês informado */
function getDaysInMonth(year: number, month: number) {
  const days: Date[] = [];
  const count = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= count; d++) days.push(new Date(year, month, d));
  return days;
}

/** Domingo da semana da data informada */
function getWeekStart(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Lista de datas da semana da data informada */
function getWeekDays(date: Date) {
  const start = getWeekStart(date);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

const shortDayLabels: Record<number, string> = {
  0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb',
};

const frequencyLabels: Record<GoalFrequency, string> = {
  daily: 'Metas Diárias',
  weekly: 'Metas Semanais',
  monthly: 'Metas Mensais',
};

export default function GoalsPage() {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const { goals, completions, toggleCompletion, isCompleted, deleteGoal } = useGoalStore();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  const dateStr = formatDateStr(selectedDate);
  const todayStr = formatDateStr(today);
  const monthDays = useMemo(
    () => getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth()),
    [selectedDate]
  );

  // Chaves de período usadas para marcar metas semanais/mensais
  const weekKey = formatDateStr(getWeekStart(selectedDate));
  const monthKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-01`;

  const keyFor = (frequency: GoalFrequency) =>
    frequency === 'daily' ? dateStr : frequency === 'weekly' ? weekKey : monthKey;

  useEffect(() => {
    const el = dateScrollRef.current;
    const active = el?.querySelector('[data-active="true"]') as HTMLElement | null;
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [dateStr]);

  const dailyGoals = goals.filter((g) => g.frequency === 'daily');
  const weeklyGoals = goals.filter((g) => g.frequency === 'weekly');
  const monthlyGoals = goals.filter((g) => g.frequency === 'monthly');

  // Progresso do dia (metas diárias marcadas no dia selecionado)
  const dayDone = dailyGoals.filter((g) => isCompleted(g.id, dateStr)).length;
  const dayProgress = dailyGoals.length ? Math.round((dayDone / dailyGoals.length) * 100) : 0;

  // Progresso da semana (todas as marcações diárias da semana + metas semanais)
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const weekTotal = dailyGoals.length * 7 + weeklyGoals.length;
  const weekDone =
    weekDays.reduce(
      (acc, d) => acc + dailyGoals.filter((g) => isCompleted(g.id, formatDateStr(d))).length,
      0
    ) + weeklyGoals.filter((g) => isCompleted(g.id, weekKey)).length;
  const weekProgress = weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0;

  // Progresso do mês
  const monthTotal = dailyGoals.length * monthDays.length + monthlyGoals.length;
  const monthDone =
    monthDays.reduce(
      (acc, d) => acc + dailyGoals.filter((g) => isCompleted(g.id, formatDateStr(d))).length,
      0
    ) + monthlyGoals.filter((g) => isCompleted(g.id, monthKey)).length;
  const monthProgress = monthTotal ? Math.round((monthDone / monthTotal) * 100) : 0;

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const ProgressBlock = ({
    label,
    value,
    done,
    total,
    gradient,
  }: { label: string; value: number; done: number; total: number; gradient: string }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {done}/{total} · {value}%
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', gradient)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );

  const GoalList = ({ list, frequency }: { list: Goal[]; frequency: GoalFrequency }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">{frequencyLabels[frequency]}</h2>
        <span className="text-xs text-muted-foreground">{list.length} meta(s)</span>
      </div>
      {list.length === 0 ? (
        <GlassCard className="p-6 text-center">
          <Target className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">Nenhuma meta cadastrada</p>
        </GlassCard>
      ) : (
        <AnimatePresence initial={false}>
          {list.map((goal, index) => {
            const key = keyFor(frequency);
            const completed = isCompleted(goal.id, key);
            return (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.04 }}
              >
                <div
                  className={cn(
                    'glass-card rounded-xl p-4 flex items-center gap-4 transition-all duration-200 cursor-pointer',
                    completed && 'border-success/30'
                  )}
                  onClick={() => toggleCompletion(goal.id, key)}
                >
                  <Checkbox
                    checked={completed}
                    onCheckedChange={() => toggleCompletion(goal.id, key)}
                    className={cn(
                      'h-5 w-5 rounded-md border-2 transition-all',
                      completed
                        ? 'border-success bg-success data-[state=checked]:bg-success data-[state=checked]:border-success'
                        : 'border-muted-foreground'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium transition-all truncate',
                        completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground truncate">{goal.description}</p>
                    )}
                  </div>
                  {goal.category && (
                    <span className="hidden sm:inline text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full shrink-0">
                      {goal.category}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditGoal(goal);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGoal(goal.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold neon-text-primary">Metas</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Marque suas metas do dia e acompanhe o progresso
            </p>
          </div>
          <Button
            variant="neon"
            className="w-full sm:w-auto"
            onClick={() => {
              setSelectedGoal(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Nova Meta
          </Button>
        </div>

        {/* Stats do dia */}
        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="p-4 text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{dailyGoals.length}</p>
            <p className="text-xs text-muted-foreground">Metas do dia</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold">{dayDone}</p>
            <p className="text-xs text-muted-foreground">Concluídas</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Flame className="w-5 h-5 text-warning mx-auto mb-1" />
            <p className="text-2xl font-bold">{dayProgress}%</p>
            <p className="text-xs text-muted-foreground">Progresso</p>
          </GlassCard>
        </div>

        {/* Régua de dias */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {weekDays.map((d) => {
              const isSelected = formatDateStr(d) === dateStr;
              return (
                <button
                  key={formatDateStr(d)}
                  onClick={() => setSelectedDate(d)}
                  className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg neon-glow-primary'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {shortDayLabels[d.getDay()]}
                </button>
              );
            })}
          </div>

          <div ref={dateScrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {monthDays.map((date) => {
              const ds = formatDateStr(date);
              const isSelected = ds === dateStr;
              const isToday = ds === todayStr;
              const hasRecord = (completions ?? []).some((c) => c.date === ds);
              return (
                <button
                  key={ds}
                  data-active={isSelected ? 'true' : undefined}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    'flex-shrink-0 flex flex-col items-center min-w-[44px] px-2 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg neon-glow-primary'
                      : isToday
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <span className="text-[10px] opacity-70">{shortDayLabels[date.getDay()]}</span>
                  <span className="text-sm font-semibold">{date.getDate()}</span>
                  <span
                    className={cn(
                      'w-1 h-1 rounded-full mt-1',
                      hasRecord ? 'bg-success' : 'bg-transparent'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Barras de progresso: dia, semana e mês */}
        <GlassCard className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
          <ProgressBlock
            label="Hoje"
            value={dayProgress}
            done={dayDone}
            total={dailyGoals.length}
            gradient="bg-gradient-to-r from-primary to-secondary"
          />
          <ProgressBlock
            label="Semana"
            value={weekProgress}
            done={weekDone}
            total={weekTotal}
            gradient="bg-gradient-to-r from-secondary to-primary"
          />
          <ProgressBlock
            label="Mês"
            value={monthProgress}
            done={monthDone}
            total={monthTotal}
            gradient="bg-gradient-to-r from-success to-primary"
          />
        </GlassCard>

        {/* Listas de metas */}
        <div className="space-y-6">
          <GoalList list={dailyGoals} frequency="daily" />
          <GoalList list={weeklyGoals} frequency="weekly" />
          <GoalList list={monthlyGoals} frequency="monthly" />
        </div>
      </div>

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />
    </MainLayout>
  );
}
