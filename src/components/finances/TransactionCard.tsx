import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Transaction } from '@/types';
import { useFinanceStore } from '@/stores/financeStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
}

export function TransactionCard({ transaction, onEdit }: TransactionCardProps) {
  const { deleteTransaction, categories } = useFinanceStore();
  const category = categories.find((c) => c.id === transaction.categoryId);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass-card-hover rounded-xl p-4 group"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Category Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: category ? `${category.color}20` : 'hsl(var(--muted))',
            }}
          >
            <span style={{ color: category?.color || 'hsl(var(--muted-foreground))' }}>
              {category ? getIcon(category.icon) : <TrendingUp className="w-5 h-5" />}
            </span>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{category?.name || 'Sem categoria'}</h3>
              {transaction.type === 'income' ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
            </div>
            {transaction.description && (
              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                {transaction.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(transaction.date), "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Amount */}
          <p
            className={cn(
              'text-lg font-bold',
              transaction.type === 'income' ? 'text-success' : 'text-destructive'
            )}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(transaction)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => deleteTransaction(transaction.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
