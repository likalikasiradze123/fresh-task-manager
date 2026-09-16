import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avubvvqwczxqlucypuop.supabase.co';
const supabaseAnonKey = 'sb_publishable_UNstdqOiUiArSNTst0hV1w_ieZWfSpF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);