import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jbdljdwlfimvmqybzynv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZGxqZHdsZmltdm1xeWJ6eW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDE4OTksImV4cCI6MjA5MDM3Nzg5OX0.HYn_-qGrRwwrkkKWE-xXlVGKpb2kTSCCgmbGmrV-lt0";

export const supabase = createClient(supabaseUrl, supabaseKey);
