import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jhuprucxucrspvnjtdyq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodXBydWN4dWNyc3B2bmp0ZHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTYxNjAsImV4cCI6MjA5MTc3MjE2MH0.FLD5ZawdzXvngqU6gMYSdAldC1Dn_UXezdM0C6Z7aKM'
)

export default supabase