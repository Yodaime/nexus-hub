
CREATE TABLE public.foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'outro',
  calories NUMERIC NOT NULL DEFAULT 0,
  protein NUMERIC NOT NULL DEFAULT 0,
  carbs NUMERIC NOT NULL DEFAULT 0,
  fat NUMERIC NOT NULL DEFAULT 0,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'porção',
  meal TEXT NOT NULL DEFAULT 'almoço',
  consumed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own foods"
  ON public.foods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own foods"
  ON public.foods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own foods"
  ON public.foods FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own foods"
  ON public.foods FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_foods_user_id ON public.foods(user_id);
CREATE INDEX idx_foods_consumed_at ON public.foods(consumed_at DESC);
