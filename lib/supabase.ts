import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://matsmgwkubmoowryxech.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdHNtZ3drdWJtb293cnl4ZWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwOTU0MzQsImV4cCI6MjA5NzY3MTQzNH0.Z_IwFQmC_dawgqkOBKkKnUJ0fhFj94zB516azxRn4Vo'

export const supabase = createClient(supabaseUrl, supabaseKey)
