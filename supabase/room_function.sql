-- Function to fetch public room data securely, bypassing RLS but strictly enforcing room visibility settings
CREATE OR REPLACE FUNCTION public.get_public_room_data(room_code_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_room record;
  v_user record;
  v_entries record;
  v_checkpoints text[] := '{}';
  v_days_completed integer := 0;
  v_current_streak integer := 0;
  v_longest_streak integer := 0;
  v_temp_streak integer := 0;
  v_previous_date date := null;
  v_result json;
  v_entry record;
  v_today date := current_date;
BEGIN
  -- 1. Get the active room
  SELECT * INTO v_room FROM public.rooms WHERE code = room_code_input AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- 2. Get user info
  SELECT name, arc_start_date, arc_duration_days INTO v_user FROM public.users WHERE id = v_room.owner_id;

  -- 3. Calculate streaks and days completed if needed
  IF (v_room.visibility_settings->>'show_streak')::boolean OR (v_room.visibility_settings->>'show_completion')::boolean THEN
    FOR v_entry IN 
      SELECT date FROM public.daily_entries WHERE user_id = v_room.owner_id ORDER BY date ASC
    LOOP
      v_days_completed := v_days_completed + 1;
      
      IF v_previous_date IS NULL THEN
        v_temp_streak := 1;
      ELSE
        IF v_entry.date - v_previous_date = 1 THEN
          v_temp_streak := v_temp_streak + 1;
        ELSE
          v_temp_streak := 1;
        END IF;
      END IF;

      IF v_temp_streak > v_longest_streak THEN
        v_longest_streak := v_temp_streak;
      END IF;
      
      v_current_streak := v_temp_streak;
      v_previous_date := v_entry.date;
    END LOOP;

    -- Break streak if missed today and yesterday
    IF v_previous_date IS NOT NULL AND (v_today - v_previous_date > 1) THEN
      v_current_streak := 0;
    END IF;
  END IF;

  -- 4. Get last checkpoints if allowed
  IF (v_room.visibility_settings->>'show_checkpoints')::boolean THEN
    SELECT checkpoints INTO v_checkpoints
    FROM public.daily_entries 
    WHERE user_id = v_room.owner_id 
    ORDER BY date DESC LIMIT 1;
  END IF;

  -- 5. Construct result JSON
  SELECT json_build_object(
    'owner_name', v_user.name,
    'total_days', v_user.arc_duration_days,
    'days_completed', CASE WHEN (v_room.visibility_settings->>'show_completion')::boolean THEN v_days_completed ELSE null END,
    'current_streak', CASE WHEN (v_room.visibility_settings->>'show_streak')::boolean THEN v_current_streak ELSE null END,
    'longest_streak', CASE WHEN (v_room.visibility_settings->>'show_streak')::boolean THEN v_longest_streak ELSE null END,
    'last_checkpoints', CASE WHEN (v_room.visibility_settings->>'show_checkpoints')::boolean THEN v_checkpoints ELSE null END
  ) INTO v_result;

  RETURN v_result;
END;
$$;
