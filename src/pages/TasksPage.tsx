import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskModal } from '@/components/tasks/TaskModal';
import { useTaskStore } from '@/stores/taskStore';
import { Task, TaskStatus } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CHART_COLORS = {
  completed: '#22c55e',
  'in-progress': '#00d4ff',
  pending: '#6b7280',
};

export default function TasksPage() {
  const { tasks } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const overdue = tasks.filter(
      (t) => new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length;

    return { total, completed, inProgress, pending, overdue };
  }, [tasks]);

  // Pie chart data
  const pieData = useMemo(() => {
    return [
      { name: 'Concluídas', value: stats.completed, color: CHART_COLORS.completed },
      { name: 'Em Andamento', value: stats.inProgress, color: CHART_COLORS['in-progress'] },
      { name: 'Pendentes', value: stats.pending, color: CHART_COLORS.pending },
    ].filter((d) => d.value > 0);
  }, [stats]);

  // Bar chart data (tasks by day)
  const barData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const created = tasks.filter((t) => {
        const createdAt = new Date(t.createdAt);
        return createdAt >= dayStart && createdAt <= dayEnd;
      }).length;

      const completed = tasks.filter((t) => {
        const updatedAt = new Date(t.updatedAt);
        return (
          t.status === 'completed' &&
          updatedAt >= dayStart &&
          updatedAt <= dayEnd
        );
      }).length;

      return {
        day: format(date, 'EEE', { locale: ptBR }),
        criadas: created,
        concluídas: completed,
      };
    });

    return last7Days;
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold neon-text-primary">Tarefas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas tarefas e acompanhe o progresso
            </p>
          </div>
          <Button variant="neon" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<ListTodo className="w-5 h-5" />}
            variant="default"
          />
          <StatCard
            title="Concluídas"
            value={stats.completed}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Em Andamento"
            value={stats.inProgress}
            icon={<Clock className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Pendentes"
            value={stats.pending}
            icon={<ListTodo className="w-5 h-5" />}
            variant="default"
          />
          <StatCard
            title="Atrasadas"
            value={stats.overdue}
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="destructive"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Progresso Geral
            </h3>
            <div className="flex items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(240 10% 8%)',
                        border: '1px solid hsl(240 10% 18%)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{completionRate}%</p>
                    <p className="text-xs text-muted-foreground">Concluído</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Atividade Semanal</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(240 10% 8%)',
                    border: '1px solid hsl(240 10% 18%)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="criadas"
                  fill="#00d4ff"
                  radius={[4, 4, 0, 0]}
                  name="Criadas"
                />
                <Bar
                  dataKey="concluídas"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Concluídas"
                />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas ou tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-40 bg-muted/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-muted/50">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <ListTodo className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeira tarefa
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
      />
    </MainLayout>
  );
}
