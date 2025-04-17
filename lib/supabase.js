import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gerbskohkhtylwligavq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlcmJza29oa2h0eWx3bGlnYXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MjI2MDQsImV4cCI6MjA2MDQ5ODYwNH0.v1Lz-iwsA_YrG8cW6sz1ArWb2Cb3FoexaSCr1XoUVNU';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 