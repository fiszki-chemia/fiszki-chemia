import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ehfnsrzbtcrgnrueykey.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoZm5zcnpidGNyZ25ydWV5a2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjU0MjUsImV4cCI6MjA3MjUwMTQyNX0.D4gOXVwgr_X8dNAIZ6bfnCDBfKiNO-t9KU55huQYfPA'
export const supabase = createClient(supabaseUrl, supabaseKey)
