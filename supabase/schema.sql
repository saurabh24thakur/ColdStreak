-- Create users table
CREATE TABLE public.users (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  arc_start_date date,
  arc_duration_days integer default 90,
  theme_preference text default 'system',
  core_goals text[] default '{"Workout", "Study", "Sleep"}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DailyEntry table
CREATE TABLE public.daily_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  date date not null,
  metrics jsonb,
  raw_description text,
  checkpoints text[],
  status text default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date)
);

-- Room table
CREATE TABLE public.rooms (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.users on delete cascade not null,
  code text unique not null,
  is_active boolean default true,
  visibility_settings jsonb default '{"show_streak": true, "show_completion": true, "show_checkpoints": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Policies for public.users
CREATE POLICY "Users can view their own profile"
ON public.users FOR SELECT
USING ( auth.uid() = id );

CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
USING ( auth.uid() = id );

-- Policies for public.daily_entries
CREATE POLICY "Users can view their own daily entries"
ON public.daily_entries FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own daily entries"
ON public.daily_entries FOR INSERT
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own daily entries"
ON public.daily_entries FOR UPDATE
USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own daily entries"
ON public.daily_entries FOR DELETE
USING ( auth.uid() = user_id );

-- Policies for public.rooms
CREATE POLICY "Users can manage their own rooms"
ON public.rooms FOR ALL
USING ( auth.uid() = owner_id );

CREATE POLICY "Anyone can view active rooms"
ON public.rooms FOR SELECT
USING ( is_active = true );

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signups
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
