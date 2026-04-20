import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MealType, useNutriStore } from '@/stores/nutriStore';
import { toast } from 'sonner';

interface TodayMealModalProps {
  open: boolean;
  onClose: () => void;
}

const MEALS: { value: MealType; label: string }[] = [
  { value: 'café', label: 'Café da manhã' },
  { value: 'lanche-manhã', label: 'Lanche da manhã' },
  { value: 'almoço', label: 'Almoço' },
  { value: 'lanche-tarde', label: 'Lanche da tarde' },
  { value: 'jantar', label: 'Jantar' },
  { value: 'ceia', label: 'Ceia' },
];

export function TodayMealModal({ open, onClose }: TodayMealModalProps) {
  const { templates, logConsumption } = useNutriStore();
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [meal, setMeal] = useState<MealType>('almoço');

  useEffect(() => {
    if (open) {
      setTemplateId(templates[0]?.id || '');
      setQuantity(1);
      setMeal('almoço');
    }
  }, [open, templates]);

  const selected = templates.find((t) => t.id === templateId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateId) {
      toast.error('Selecione um alimento cadastrado');
      return;
    }
    if (quantity <= 0) {
      toast.error('Quantidade deve ser maior que zero');
      return;
    }
    setSaving(true);
    try {
      await logConsumption(templateId, quantity, meal, new Date().toISOString());
      toast.success('Consumo registrado!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao registrar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Comida de Hoje</DialogTitle>
        </DialogHeader>

        {templates.length === 0 ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Você ainda não cadastrou nenhum alimento. Cadastre alimentos primeiro para poder registrar seu consumo do dia.
            </p>
            <Button variant="ghost" onClick={onClose}>Fechar</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Alimento *</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.calories} kcal/{t.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantidade / Porção *</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  required
                />
                {selected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Em {selected.unit}
                  </p>
                )}
              </div>
              <div>
                <Label>Refeição</Label>
                <Select value={meal} onValueChange={(v) => setMeal(v as MealType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MEALS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selected && (
              <div className="rounded-lg border border-border/50 bg-card/50 p-3 text-xs space-y-1">
                <p className="font-medium text-sm">Total para {quantity} {selected.unit}:</p>
                <p>🔥 {Math.round(selected.calories * quantity)} kcal</p>
                <p>🍗 {(selected.protein * quantity).toFixed(1)}g proteína · 🍞 {(selected.carbs * quantity).toFixed(1)}g carbs · 💧 {(selected.fat * quantity).toFixed(1)}g gordura</p>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
              <Button type="submit" variant="neon" disabled={saving}>
                {saving ? 'Registrando...' : 'Registrar consumo'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
