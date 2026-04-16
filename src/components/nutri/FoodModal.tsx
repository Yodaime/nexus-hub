import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Food, FoodCategory, MealType, useNutriStore } from '@/stores/nutriStore';
import { toast } from 'sonner';

interface FoodModalProps {
  open: boolean;
  onClose: () => void;
  food?: Food | null;
}

const CATEGORIES: { value: FoodCategory; label: string }[] = [
  { value: 'fruta', label: '🍎 Fruta' },
  { value: 'legume', label: '🥬 Legume/Verdura' },
  { value: 'bebida', label: '🥤 Bebida' },
  { value: 'proteina', label: '🍗 Proteína' },
  { value: 'carboidrato', label: '🍞 Carboidrato' },
  { value: 'outro', label: '🍽️ Outro' },
];

const MEALS: { value: MealType; label: string }[] = [
  { value: 'café', label: 'Café da manhã' },
  { value: 'lanche-manhã', label: 'Lanche da manhã' },
  { value: 'almoço', label: 'Almoço' },
  { value: 'lanche-tarde', label: 'Lanche da tarde' },
  { value: 'jantar', label: 'Jantar' },
  { value: 'ceia', label: 'Ceia' },
];

export function FoodModal({ open, onClose, food }: FoodModalProps) {
  const { addFood, updateFood } = useNutriStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'outro' as FoodCategory,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    quantity: 1,
    unit: 'porção',
    meal: 'almoço' as MealType,
    consumed_at: new Date().toISOString().slice(0, 16),
    notes: '',
  });

  useEffect(() => {
    if (food) {
      setForm({
        name: food.name,
        category: food.category,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        quantity: food.quantity,
        unit: food.unit,
        meal: food.meal,
        consumed_at: new Date(food.consumed_at).toISOString().slice(0, 16),
        notes: food.notes || '',
      });
    } else {
      setForm({
        name: '',
        category: 'outro',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        quantity: 1,
        unit: 'porção',
        meal: 'almoço',
        consumed_at: new Date().toISOString().slice(0, 16),
        notes: '',
      });
    }
  }, [food, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Nome do alimento é obrigatório');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        consumed_at: new Date(form.consumed_at).toISOString(),
      };
      if (food) {
        await updateFood(food.id, payload);
        toast.success('Alimento atualizado!');
      } else {
        await addFood(payload);
        toast.success('Alimento cadastrado!');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{food ? 'Editar Alimento' : 'Cadastrar Alimento'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Maçã, Frango grelhado, Suco de laranja..."
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as FoodCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Refeição</Label>
              <Select value={form.meal} onValueChange={(v) => setForm({ ...form, meal: v as MealType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MEALS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="col-span-2">
              <Label>Unidade</Label>
              <Input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="g, ml, porção, unidade..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label>Calorias (kcal)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Proteína (g)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.protein}
                onChange={(e) => setForm({ ...form, protein: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Carbs (g)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.carbs}
                onChange={(e) => setForm({ ...form, carbs: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Gordura (g)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={form.fat}
                onChange={(e) => setForm({ ...form, fat: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <Label>Data e hora do consumo</Label>
            <Input
              type="datetime-local"
              value={form.consumed_at}
              onChange={(e) => setForm({ ...form, consumed_at: e.target.value })}
            />
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Opcional..."
              maxLength={500}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
            <Button type="submit" variant="neon" disabled={saving}>
              {saving ? 'Salvando...' : food ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
