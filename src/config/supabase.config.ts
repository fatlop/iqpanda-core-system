import { createClient } from '@supabase/supabase-js';

export const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials missing in environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
};

export const getSupabaseServiceClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase service credentials missing in environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
};
