import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Moon, Trash2, Heart } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMoodStore, SleepRange, MoodLevel } from '@/stores/moodStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const sleepOptions: { value: SleepRange; label: string }[] = [
  { value: '4-6', label: '4 a 6h' },
  { value: '6-8', label: '6 a 8h' },
  { value: '8-10', label: '8 a 10h' },
];

const moodOptions: { value: MoodLevel; emoji: string; label: string }[] = [
  { value: 1, emoji: '😢', label: 'Muito triste' },
  { value: 2, emoji: '😕', label: 'Triste' },
  { value: 3, emoji: '😐', label: 'Neutro' },
  { value: 4, emoji: '🙂', label: 'Feliz' },
  { value: 5, emoji: '😄', label: 'Muito feliz' },
];

export default function MoodPage() {
  const { entries, addEntry, deleteEntry } = useMoodStore();
  const [sleep, setSleep] = useState<SleepRange | null>(null);
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = useMemo(() => entries.find((e) => e.date === today), [entries, today]);

  const handleSave = () => {
    if (!sleep || !mood) {
      toast.error('Selecione horas de sono e humor');
      return;
    }
    addEntry({ date: today, sleep, mood, note: note.trim() || undefined });
    setSleep(null);
    setMood(null);
    setNote('');
    toast.success('Registro salvo!');
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-24 lg:pb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Moon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Sono e Humor</h1>
            <p className="text-sm text-muted-foreground">Registre seu bem-estar diário</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 space-y-6"
        >
          {todayEntry && (
            <div className="text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3">
              Você já registrou hoje. Novo envio criará um registro adicional.
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">Dormiu bem essa noite?</h3>
            <div className="grid grid-cols-3 gap-2">
              {sleepOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSleep(opt.value)}
                  className={cn(
                    'py-3 px-2 rounded-xl border transition-all text-sm font-medium',
                    sleep === opt.value
                      ? 'bg-primary/15 border-primary text-primary'
                      : 'border-border/50 hover:border-primary/40 text-foreground'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Como esteve seu humor durante o dia?</h3>
            <div className="flex justify-between gap-2">
              {moodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMood(opt.value)}
                  title={opt.label}
                  className={cn(
                    'flex-1 py-3 rounded-xl border text-3xl transition-all',
                    mood === opt.value
                      ? 'bg-primary/15 border-primary scale-110'
                      : 'border-border/50 hover:border-primary/40 opacity-70 hover:opacity-100'
                  )}
                >
                  {opt.emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-sm">Observações (opcional)</h3>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Como foi seu dia?"
              rows={3}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Salvar registro
          </Button>
        </motion.div>

        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Histórico
          </h2>
          {entries.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground text-sm">
              Nenhum registro ainda
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((e) => {
                const moodOpt = moodOptions.find((m) => m.value === e.mood);
                const sleepOpt = sleepOptions.find((s) => s.value === e.sleep);
                return (
                  <div
                    key={e.id}
                    className="glass-card rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="text-3xl">{moodOpt?.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {new Date(e.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Sono: {sleepOpt?.label} · Humor: {moodOpt?.label}
                      </div>
                      {e.note && (
                        <div className="text-xs text-foreground/80 mt-1 line-clamp-2">
                          {e.note}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEntry(e.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </MainLayout>
  );
}
