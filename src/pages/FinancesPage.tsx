import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
  ArrowUpDown,
  PiggyBank,
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { TransactionCard } from '@/components/finances/TransactionCard';
import { TransactionModal } from '@/components/finances/TransactionModal';
import { exportTransactionsReport } from '@/components/finances/exportTransactionsReport';
import { useFinanceStore } from '@/stores/financeStore';
import { useSavingsStore } from '@/stores/savingsStore';
import { Transaction } from '@/types';
import { SavingsBoxModal } from '@/components/finances/SavingsBoxModal';
import { SavingsBoxCard } from '@/components/finances/SavingsBoxCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FinancesPage() {
  const { transactions, categories, getTotalByType, getBalance } = useFinanceStore();
  const { boxes } = useSavingsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [periodFilter, setPeriodFilter] = useState('month');

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    if (periodFilter === 'all') return transactions;
    const now = new Date();
    let start: Date, end: Date;
    switch (periodFilter) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 0 });
        end = endOfWeek(now, { weekStartsOn: 0 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      default:
        return transactions;
    }
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return isWithinInterval(d, { start, end });
    });
  }, [transactions, periodFilter]);

  // Stats based on filtered transactions
  const totalIncome = useMemo(() =>
    filteredTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );
  const totalExpense = useMemo(() =>
    filteredTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );
  const balance = totalIncome - totalExpense;

  // Pie chart data (expenses by category) — filtered
  const pieData = useMemo(() => {
    const expenseCategories = categories.filter((c) => c.type === 'expense');
    return expenseCategories
      .map((category) => {
        const total = filteredTransactions
          .filter((t) => t.categoryId === category.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          name: category.name,
          value: total,
          color: category.color,
        };
      })
      .filter((d) => d.value > 0);
  }, [filteredTransactions, categories]);

  // Line chart data (cash flow) — filtered
  const lineData = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;
    switch (periodFilter) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 0 });
        end = endOfWeek(now, { weekStartsOn: 0 });
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
    }

    if (periodFilter === 'year') {
      const months = eachMonthOfInterval({ start, end });
      let cumulativeBalance = 0;
      return months.map((month) => {
        const monthTx = filteredTransactions.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
        });
        const inc = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const exp = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        cumulativeBalance += inc - exp;
        return { day: format(month, 'MMM', { locale: ptBR }), saldo: cumulativeBalance, receitas: inc, despesas: exp };
      });
    }

    const days = eachDayOfInterval({ start, end });
    let cumulativeBalance = 0;
    return days.map((day) => {
      const dayTx = filteredTransactions.filter((t) => {
        const d = new Date(t.date);
        return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear();
      });
      const inc = dayTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const exp = dayTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      cumulativeBalance += inc - exp;
      return { day: format(day, 'dd', { locale: ptBR }), saldo: cumulativeBalance, receitas: inc, despesas: exp };
    });
  }, [filteredTransactions, periodFilter]);

  // Sorted filtered transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredTransactions]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const exportData = () => {
    const csv = exportTransactionsReport(transactions, categories);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_financeiro_${new Date().toISOString().slice(0,7)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold neon-text-secondary">Finanças</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Controle suas receitas e despesas
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-36 bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportData} className="flex-1 sm:flex-none">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button variant="outline" onClick={() => setIsSavingsModalOpen(true)} className="flex-1 sm:flex-none">
              <PiggyBank className="w-4 h-4" />
              Caixinhas
            </Button>
            <Button variant="neon" onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none">
              <Plus className="w-4 h-4" />
              Nova Transação
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <StatCard
            title="Receitas"
            value={formatCurrency(totalIncome)}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Despesas"
            value={formatCurrency(totalExpense)}
            icon={<TrendingDown className="w-5 h-5" />}
            variant="destructive"
          />
          <StatCard
            title="Saldo"
            value={formatCurrency(balance)}
            icon={<Wallet className="w-5 h-5" />}
            variant={balance >= 0 ? 'primary' : 'destructive'}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Expenses by Category */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        background: 'hsl(240 10% 8%)',
                        border: '1px solid hsl(240 10% 18%)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
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
              </>
            ) : (
              <div className="h-[220px] flex items-center justify-center">
                <p className="text-muted-foreground">Nenhuma despesa registrada</p>
              </div>
            )}
          </GlassCard>

          {/* Cash Flow */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa Mensal</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    background: 'hsl(240 10% 8%)',
                    border: '1px solid hsl(240 10% 18%)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="saldo"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSaldo)"
                  name="Saldo Acumulado"
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Savings Boxes */}
        {boxes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-primary" />
              Caixinhas
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {boxes.map((box) => (
                  <SavingsBoxCard key={box.id} box={box} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Transactions Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Transações Recentes</h3>
        </div>
              <SelectItem value="year">Este Ano</SelectItem>
              <SelectItem value="all">Todas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.slice(0, 10).map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma transação registrada</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar primeira transação
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={editingTransaction}
      />
      <SavingsBoxModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
      />
    </MainLayout>
  );
}
