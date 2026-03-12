import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { SavingsBox } from '@/types';
import { useSavingsStore } from '@/stores/savingsStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SavingsBoxCardProps {
  box: SavingsBox;
}

export function SavingsBoxCard({ box }: SavingsBoxCardProps) {
  const { addDeposit, deleteBox, removeDeposit } = useSavingsStore();
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const progress = box.targetAmount > 0 ? Math.min((box.currentAmount / box.targetAmount) * 100, 100) : 0;
  const isCompleted = progress >= 100;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;
    addDeposit(box.id, amount, depositNote || undefined);
    setDepositAmount('');
    setDepositNote('');
    setShowDeposit(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-4 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${box.color}20` }}
          >
            <PiggyBank className="w-5 h-5" style={{ color: box.color }} />
          </div>
          <div>
            <h4 className="font-semibold">{box.name}</h4>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(box.currentAmount)} de {formatCurrency(box.targetAmount)}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteBox(box.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-1.5">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress.toFixed(0)}%</span>
          {!isCompleted && <span>Faltam {formatCurrency(box.targetAmount - box.currentAmount)}</span>}
          {isCompleted && <span className="text-green-400 font-medium">🎉 Meta alcançada!</span>}
        </div>
      </div>

      {!isCompleted && (
        <>
          {!showDeposit ? (
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowDeposit(true)}>
              <Plus className="w-4 h-4 mr-1" /> Guardar valor
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
              <Input
                type="number"
                placeholder="Valor (R$)"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min={0}
                step={0.01}
              />
              <Input
                placeholder="Nota (opcional)"
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowDeposit(false)}>
                  Cancelar
                </Button>
                <Button variant="neon" size="sm" className="flex-1" onClick={handleDeposit} disabled={!depositAmount}>
                  Confirmar
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {box.deposits.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            Histórico ({box.deposits.length})
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-1 max-h-32 overflow-y-auto"
              >
                {[...box.deposits].reverse().map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/30">
                    <div>
                      <span className="text-green-400 font-medium">+{formatCurrency(d.amount)}</span>
                      {d.note && <span className="text-muted-foreground ml-2">{d.note}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{format(new Date(d.date), 'dd/MM', { locale: ptBR })}</span>
                      <button onClick={() => removeDeposit(box.id, d.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
