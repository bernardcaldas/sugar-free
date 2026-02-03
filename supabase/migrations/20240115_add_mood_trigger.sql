-- Migration to add mood and trigger columns to daily_logs table

ALTER TABLE public.daily_logs 
ADD COLUMN IF NOT EXISTS mood text,
ADD COLUMN IF NOT EXISTS trigger text;

-- Optional: Add check constraints or comments
COMMENT ON COLUMN public.daily_logs.mood IS 'User mood when logging (e.g., Happy, Stressed)';
COMMENT ON COLUMN public.daily_logs.trigger IS 'Trigger for sugar consumption (e.g., Stress, Social, Cravings)';
