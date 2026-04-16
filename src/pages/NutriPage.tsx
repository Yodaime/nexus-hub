import { useEffect, useMemo, useState } from 'react';
import { Plus, Apple, Flame, Beef, Wheat, Droplet, Trash2, Edit2, Calendar } from 'lucide-react';
import { format, isToday, isThisWeek, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { StatCard } from '@/components/ui/stat-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FoodModal } from '@/components/nutri/FoodModal';
import { Food, useNutriStore } from '@/stores/nutriStore';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';

const CATEGORY_LABELS: Record<string, string> = {
  fruta: '🍎 Fruta',
  legume: '🥬 Legume',
  bebida: '🥤 Bebida',
  proteina: '🍗 Proteína',
  carboidrato: '🍞 Carboidrato',
  outro: '🍽️ Outro',
};

const MEAL_LABELS: Record<string, string> = {
  'café': 'Café',
  'lanche-manhã': 'Lanche manhã',
  'almoço': 'Almoço',
  'lanche-tarde': 'Lanche tarde',
  'jantar': 'Jantar',
  'ceia': 'Ceia',
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function NutriPage() {
  const { foods, fetchFoods, deleteFood, loading } = useNutriStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [period, setPeriod] = useState<'today' | 'week' | 'all'>('week');

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const filtered = useMemo(() => {
    if (period === 'all') return foods;
    return foods.filter((f) => {
      const d = new Date(f.consumed_at);
      if (period === 'today') return isToday(d);
      return isThisWeek(d, { weekStartsOn: 1 });
    });
  }, [foods, period]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, f) => ({
        calories: acc.calories + Number(f.calories) * Number(f.quantity),
        protein: acc.protein + Number(f.protein) * Number(f.quantity),
        carbs: acc.carbs + Number(f.carbs) * Number(f.quantity),
        fat: acc.fat + Number(f.fat) * Number(f.quantity),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [filtered]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((f) => {
      map[f.category] = (map[f.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name: CATEGORY_LABELS[name] || name, value }));
  }, [filtered]);

  const weekData = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    return days.map((day) => {
      const dayFoods = foods.filter((f) => {
        const d = new Date(f.consumed_at);
        return d.toDateString() === day.toDateString();
      });
      const calories = dayFoods.reduce((sum, f) => sum + Number(f.calories) * Number(f.quantity), 0);
      return {
        day: format(day, 'EEE', { locale: ptBR }),
        calorias: Math.round(calories),
      };
    });
  }, [foods]);

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingFood(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFood(id);
      toast.success('Alimento removido');
    } catch {
      toast.error('Erro ao remover');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold neon-text-primary flex items-center gap-2">
              <Apple className="w-7 h-7" /> Nutri
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Acompanhe sua alimentação e dados nutricionais
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
              <SelectTrigger className="w-[120px] sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="neon" onClick={handleNew}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Cadastrar Alimento</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Calorias"
            value={`${Math.round(totals.calories)} kcal`}
            icon={Flame}
            iconColor="text-orange-500"
          />
          <StatCard
            title="Proteínas"
            value={`${totals.protein.toFixed(1)} g`}
            icon={Beef}
            iconColor="text-red-500"
          />
          <StatCard
            title="Carboidratos"
            value={`${totals.carbs.toFixed(1)} g`}
            icon={Wheat}
            iconColor="text-yellow-500"
          />
          <StatCard
            title="Gorduras"
            value={`${totals.fat.toFixed(1)} g`}
            icon={Droplet}
            iconColor="text-blue-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-4">Calorias por dia (semana)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weekData}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="calorias" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="p-4">
            <h3 className="font-semibold mb-4">Distribuição por categoria</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                Sem dados no período
              </div>
            )}
          </GlassCard>
        </div>

        {/* History */}
        <GlassCard className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Histórico de consumo
          </h3>
          {loading ? (
            <p className="text-muted-foreground text-sm text-center py-8">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Nenhum alimento cadastrado nesse período. Clique em "Cadastrar Alimento" para começar.
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{f.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {CATEGORY_LABELS[f.category]}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                        {MEAL_LABELS[f.meal]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {f.quantity} {f.unit} · {Math.round(Number(f.calories) * Number(f.quantity))} kcal ·{' '}
                      {format(new Date(f.consumed_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(f)} className="h-8 w-8">
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(f.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <FoodModal open={modalOpen} onClose={() => setModalOpen(false)} food={editingFood} />
    </MainLayout>
  );
}
