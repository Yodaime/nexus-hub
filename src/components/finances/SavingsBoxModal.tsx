import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, PiggyBank, Target, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSavingsStore } from '@/stores/savingsStore';

const ICONS = ['PiggyBank', 'Target', 'Gift', 'Car', 'Home', 'Plane', 'Heart', 'Star'];
const COLORS = ['#00d4ff', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

interface SavingsBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavingsBoxModal({ isOpen, onClose }: SavingsBoxModalProps) {
  const { addBox } = useSavingsStore();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('PiggyBank');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = () => {
    if (!name.trim() || !targetAmount) return;
    addBox({
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      icon: selectedIcon,
      color: selectedColor,
    });
    setName('');
    setTargetAmount('');
    setSelectedIcon('PiggyBank');
    setSelectedColor(COLORS[0]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card w-full max-w-md p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-primary" />
                  Nova Caixinha
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Nome</label>
                  <Input
                    placeholder="Ex: Viagem, Celular novo..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Valor da Meta</label>
                  <Input
                    type="number"
                    placeholder="R$ 0,00"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    min={0}
                    step={0.01}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Cor</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: selectedColor === color ? 'white' : 'transparent',
                          transform: selectedColor === color ? 'scale(1.15)' : undefined,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Cancelar
                </Button>
                <Button variant="neon" className="flex-1" onClick={handleSubmit} disabled={!name.trim() || !targetAmount}>
                  Criar Caixinha
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
