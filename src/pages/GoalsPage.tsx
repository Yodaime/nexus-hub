import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoalModal } from '@/components/goals/GoalModal';
import { GoalCard } from '@/components/goals/GoalCard';
import { useGoalStore } from '@/stores/goalStore';
import { Goal, GoalFrequency, GoalStatus } from '@/types';
import { cn } from '@/lib/utils';

export default function GoalsPage() {
  const { goals } = useGoalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<GoalFrequency>('daily');

  const stats = useMemo(() => {
    const notStarted = goals.filter(g => g.status === 'not-started').length;
    const inProgress = goals.filter(g => g.status === 'in-progress').length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const avgProgress = goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0;
    return { notStarted, inProgress, completed, avgProgress };
  }, [goals]);

  const filteredGoals = useMemo(() => {
    return goals.filter(g => g.frequency === selectedFrequency);
  }, [goals, selectedFrequency]);

  const goalsByStatus = useMemo(() => {
    return {
      'not-started': filteredGoals.filter(g => g.status === 'not-started'),
      'in-progress': filteredGoals.filter(g => g.status === 'in-progress'),
      'completed': filteredGoals.filter(g => g.status === 'completed'),
    };
  }, [filteredGoals]);

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoal(null);
  };

  const KanbanColumn = ({ status, title, goals }: { status: GoalStatus; title: string; goals: Goal[] }) => (
    <div className="flex-1 min-w-[280px] bg-muted/30 rounded-lg p-4 border border-border/50">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center gap-2 w-full mb-4">
          <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground">{goals.length} meta(s)</span>
          <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground transition-transform duration-200" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 min-h-[200px]">
            {goals.length > 0 ? (
              goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                Nenhuma meta
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
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
              Organize suas metas diárias e semanais
            </p>
          </div>
          <Button
            variant="neon"
            onClick={() => {
              setSelectedGoal(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Nova Meta
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <StatCard
            title="Não Iniciado"
            value={stats.notStarted}
            icon={<Target className="w-5 h-5" />}
            variant="default"
          />
          <StatCard
            title="Em Progresso"
            value={stats.inProgress}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Concluído"
            value={stats.completed}
            icon={<Target className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Progresso Médio"
            value={`${stats.avgProgress}%`}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="secondary"
          />
        </div>

        {/* Frequency Tabs */}
        <Tabs
          value={selectedFrequency}
          onValueChange={(value) => setSelectedFrequency(value as GoalFrequency)}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="daily">Diárias</TabsTrigger>
            <TabsTrigger value="weekly">Semanais</TabsTrigger>
          </TabsList>

          {/* Kanban Board */}
          <TabsContent value={selectedFrequency} className="mt-6">
            <motion.div
              layout
              className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:overflow-x-visible md:mx-0 md:px-0"
            >
              <KanbanColumn
                status="not-started"
                title="Não Iniciado"
                goals={goalsByStatus['not-started']}
              />
              <KanbanColumn
                status="in-progress"
                title="Em Progresso"
                goals={goalsByStatus['in-progress']}
              />
              <KanbanColumn
                status="completed"
                title="Concluído"
                goals={goalsByStatus['completed']}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      <GoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        goal={selectedGoal}
      />
    </MainLayout>
  );
}
