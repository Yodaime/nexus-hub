import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calendar, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
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
import { Transaction, TransactionType } from '@/types';
import { useFinanceStore } from '@/stores/financeStore';
import { cn } from '@/lib/utils';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
  const { addTransaction, updateTransaction, categories } = useFinanceStore();
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    amount: transaction?.amount?.toString() || '',
    categoryId: transaction?.categoryId || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    type: transaction?.type || 'expense' as TransactionType,
  });

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId,
      date: new Date(formData.date).toISOString(),
      description: formData.description,
      type: formData.type,
    };

    if (isEditing && transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onClose();
    setFormData({
      amount: '',
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: 'expense',
    });
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-4 h-4" /> : null;
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
  
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4"
            >
            <div className="glass-card rounded-2xl p-6 border border-secondary/20 mx-auto max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Editar Transação' : 'Nova Transação'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Type Toggle */}
                <div className="flex gap-2 p-1 bg-muted rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense', categoryId: '' })}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                      formData.type === 'expense'
                        ? 'bg-destructive text-destructive-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income', categoryId: '' })}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                      formData.type === 'income'
                        ? 'bg-success text-success-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Receita
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-secondary" />
                    Valor
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    className="bg-muted/50 border-border focus:border-secondary text-2xl font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger className="bg-muted/50 border-border">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <span style={{ color: category.color }}>
                                {getIcon(category.icon)}
                              </span>
                            </div>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-secondary" />
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                    className="bg-muted/50 border-border focus:border-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-secondary" />
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Adicione uma descrição..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-muted/50 border-border focus:border-secondary min-h-[80px]"
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
                  <Button
                    type="submit"
                    className={cn(
                      'flex-1',
                      formData.type === 'income'
                        ? 'bg-success hover:bg-success/90 text-success-foreground'
                        : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                    )}
                  >
                    {isEditing ? 'Salvar' : 'Adicionar'}
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
