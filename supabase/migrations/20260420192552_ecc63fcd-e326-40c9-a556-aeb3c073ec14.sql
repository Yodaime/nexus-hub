-- Adiciona coluna is_template para diferenciar alimentos cadastrados (catálogo) de consumos
ALTER TABLE public.foods 
ADD COLUMN IF NOT EXISTS is_template BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_foods_user_template ON public.foods(user_id, is_template);
CREATE INDEX IF NOT EXISTS idx_foods_user_consumed ON public.foods(user_id, consumed_at DESC);