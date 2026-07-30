import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  CheckSquare,
  Wallet,
  Repeat,
  Bell,
  Target,
  Sparkles,
  Apple,
  Moon,
  TrendingUp,
  TrendingDown,
  Flame,
  Smile,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/ui/stat-card';
import { GlassCard } from '@/components/ui/glass-card';
import { useTaskStore } from '@/stores/taskStore';
import { useFinanceStore } from '@/stores/financeStore';
import { useHabitStore, allDays } from '@/stores/habitStore';
import { useReminderStore } from '@/stores/reminderStore';
import { useGoalStore } from '@/stores/goalStore';
import { useLearningStore } from '@/stores/learningStore';
import { useNutriStore } from '@/stores/nutriStore';
import { useMoodStore } from '@/stores/moodStore';
import { cn } from '@/lib/utils';

const formatCurrency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function GeneralPage() {
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const { transactions, getBalance, getTotalByType } = useFinanceStore();
  const { habits, completions } = useHabitStore();
  const { reminders } = useReminderStore();
  const { goals } = useGoalStore();
  const { blocks } = useLearningStore();
  const { foods, fetchFoods } = useNutriStore();
  const { entries } = useMoodStore();

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayDayIdx = (new Date().getDay() + 6) % 7; // segunda=0
  const todayDay = allDays[todayDayIdx];

  const summary = useMemo(() => {
    const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const overdue = tasks.filter(
      (t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()
    ).length;

    const balance = getBalance();
    const income = getTotalByType('income');
    const expense = getTotalByType('expense');

    const habitsToday = habits.filter((h) => h.days.includes(todayDay));
    const doneToday = habitsToday.filter((h) =>
      completions.some((c) => c.habitId === h.id && c.date === todayKey)
    ).length;
    const habitProgress =
      habitsToday.length > 0 ? Math.round((doneToday / habitsToday.length) * 100) : 0;

    const activeReminders = reminders.filter((r) => !r.completed).length;
    const avgGoalProgress =
      goals.length > 0
        ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)
        : 0;

    const todayFoods = foods.filter((f) => f.consumed_at?.slice(0, 10) === todayKey);
    const todayCalories = todayFoods.reduce(
      (sum, f) => sum + (f.calories || 0) * (f.quantity || 1),
      0
    );

    const lastMood = entries[0];

    return {
      pendingTasks,
      completedTasks,
      overdue,
      balance,
      income,
      expense,
      habitProgress,
      doneToday,
      habitsTodayTotal: habitsToday.length,
      activeReminders,
      avgGoalProgress,
      todayCalories,
      lastMood,
    };
  }, [tasks, transactions, habits, completions, reminders, goals, foods, entries, todayDay, todayKey, getBalance, getTotalByType]);

  const modules = [
    {
      title: 'Tarefas',
      description: `${summary.pendingTasks} pendentes · ${summary.completedTasks} concluídas`,
      icon: CheckSquare,
      path: '/',
      color: 'from-primary to-primary/50',
    },
    {
      title: 'Finanças',
      description: `Saldo: ${formatCurrency(summary.balance)}`,
      icon: Wallet,
      path: '/finances',
      color: 'from-secondary to-secondary/50',
    },
    {
      title: 'Hábitos',
      description: `${summary.doneToday}/${summary.habitsTodayTotal} de hoje · ${summary.habitProgress}%`,
      icon: Repeat,
      path: '/habits',
      color: 'from-success to-success/50',
    },
    {
      title: 'Lembretes',
      description: `${summary.activeReminders} ativos`,
      icon: Bell,
      path: '/reminders',
      color: 'from-warning to-warning/50',
    },
    {
      title: 'Metas',
      description: `${goals.length} metas · ${summary.avgGoalProgress}% médio`,
      icon: Target,
      path: '/goals',
      color: 'from-primary to-secondary',
    },
    {
      title: 'Aprendizado',
      description: `${blocks.length} anotações`,
      icon: Sparkles,
      path: '/learning',
      color: 'from-primary/70 to-secondary/70',
    },
    {
      title: 'Nutri',
      description: `${Math.round(summary.todayCalories)} kcal hoje`,
      icon: Apple,
      path: '/nutri',
      color: 'from-success to-primary',
    },
    {
      title: 'Sono e Humor',
      description: summary.lastMood
        ? `Último humor: ${['😢','😕','😐','🙂','😄'][summary.lastMood.mood - 1]}`
        : 'Sem registros',
      icon: Moon,
      path: '/mood',
      color: 'from-secondary to-primary/50',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold neon-text-primary flex items-center gap-2">
            <LayoutGrid className="w-7 h-7" /> Geral
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Resumo geral de todos os seus módulos
          </p>
        </div>

        {/* Dashboard resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <StatCard
            title="Tarefas Pendentes"
            value={summary.pendingTasks}
            subtitle={`${summary.overdue} atrasadas`}
            icon={<CheckSquare className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Saldo"
            value={formatCurrency(summary.balance)}
            subtitle={`Receitas: ${formatCurrency(summary.income)}`}
            icon={summary.balance >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            variant={summary.balance >= 0 ? 'success' : 'destructive'}
          />
          <StatCard
            title="Hábitos de Hoje"
            value={`${summary.habitProgress}%`}
            subtitle={`${summary.doneToday}/${summary.habitsTodayTotal} concluídos`}
            icon={<Flame className="w-5 h-5" />}
            variant="warning"
          />
          <StatCard
            title="Progresso Metas"
            value={`${summary.avgGoalProgress}%`}
            subtitle={`${goals.length} metas`}
            icon={<Target className="w-5 h-5" />}
            variant="secondary"
          />
          <StatCard
            title="Lembretes Ativos"
            value={summary.activeReminders}
            icon={<Bell className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Despesas Totais"
            value={formatCurrency(summary.expense)}
            icon={<TrendingDown className="w-5 h-5" />}
            variant="destructive"
          />
          <StatCard
            title="Calorias Hoje"
            value={`${Math.round(summary.todayCalories)} kcal`}
            icon={<Apple className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Registros de Humor"
            value={entries.length}
            subtitle={summary.lastMood ? `Último: ${summary.lastMood.date}` : 'Nenhum'}
            icon={<Smile className="w-5 h-5" />}
            variant="secondary"
          />
        </div>

        {/* Blocos clicáveis */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Acessar módulos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {modules.map((m, i) => (
              <motion.button
                key={m.path}
                type="button"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(m.path)}
                className={cn(
                  'glass-card rounded-xl p-4 sm:p-5 border border-border/50 text-left',
                  'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3',
                    m.color
                  )}
                >
                  <m.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">{m.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {m.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
