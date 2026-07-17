import { useState, useMemo, useRef, useEffect } from 'react';
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

const weekDayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDaysInMonth(year: number, month: number) {
  const days: Date[] = [];
  const count = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= count; d++) days.push(new Date(year, month, d));
  return days;
}

export default function MoodPage() {
  const { entries, addEntry, deleteEntry } = useMoodStore();
  const [sleep, setSleep] = useState<SleepRange | null>(null);
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState('');

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  const monthDays = useMemo(
    () => getDaysInMonth(today.getFullYear(), today.getMonth()),
    [today]
  );

  const selectedDateStr = formatDateStr(selectedDate);
  const todayStr = formatDateStr(today);
  const selectedWeekday = selectedDate.getDay();

  useEffect(() => {
    const el = dateScrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector('[data-active="true"]') as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, []);

  const selectedEntry = useMemo(
    () => entries.find((e) => e.date === selectedDateStr),
    [entries, selectedDateStr]
  );

  const handleSelectWeekday = (jsDay: number) => {
    const current = new Date(selectedDate);
    const diff = jsDay - current.getDay();
    const target = new Date(current);
    target.setDate(current.getDate() + diff);
    if (
      target.getMonth() === today.getMonth() &&
      target.getFullYear() === today.getFullYear()
    ) {
      setSelectedDate(target);
    }
  };

  const handleSave = () => {
    if (!sleep || !mood) {
      toast.error('Selecione horas de sono e humor');
      return;
    }
    addEntry({ date: selectedDateStr, sleep, mood, note: note.trim() || undefined });
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

        {/* Weekday + date strip */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {weekDayLabels.map((label, jsDay) => (
              <button
                key={label}
                onClick={() => handleSelectWeekday(jsDay)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  selectedWeekday === jsDay
                    ? 'bg-primary text-primary-foreground shadow-lg neon-glow-primary'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            ref={dateScrollRef}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
          >
            {monthDays.map((date) => {
              const ds = formatDateStr(date);
              const isSelected = ds === selectedDateStr;
              const isToday = ds === todayStr;
              const hasEntry = entries.some((e) => e.date === ds);
              return (
                <button
                  key={ds}
                  data-active={isSelected ? 'true' : undefined}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    'relative flex-shrink-0 flex flex-col items-center min-w-[44px] px-2 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg neon-glow-primary'
                      : isToday
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <span className="text-[10px] opacity-70">
                    {weekDayLabels[date.getDay()]}
                  </span>
                  <span className="text-sm font-semibold">{date.getDate()}</span>
                  {hasEntry && (
                    <span
                      className={cn(
                        'absolute bottom-1 w-1 h-1 rounded-full',
                        isSelected ? 'bg-primary-foreground' : 'bg-primary'
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 space-y-6"
        >
          <div className="text-xs text-muted-foreground">
            Registrando para{' '}
            <span className="text-foreground font-medium">
              {selectedDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
              })}
            </span>
          </div>

          {selectedEntry && (
            <div className="text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3">
              Já existe registro para este dia. Novo envio criará um adicional.
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
                        {new Date(e.date + 'T00:00:00').toLocaleDateString('pt-BR')}
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
