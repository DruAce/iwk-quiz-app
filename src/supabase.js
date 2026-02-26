import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tgcdytepsfdupbbcmzbt.supabase.co'
const supabaseKey = 'sb_publishable_3UHTGfaF5o-i9WuUOdro9g_gTV6VEJG'

export const supabase = createClient(supabaseUrl, supabaseKey)