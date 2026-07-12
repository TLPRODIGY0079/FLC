import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database tables needed:
// - profiles (id, email, full_name, role, branch_id, avatar_url, created_at)
// - branches (id, name, location, created_at)
// - leaders (id, profile_id, branch_id, role, souls_won, members_count, created_at)
// - members (id, leader_id, full_name, phone, cell_number, status, created_at)
// - follow_ups (id, leader_id, member_name, type, status, priority, date, notes, last_contact, created_at)
// - reports (id, leader_id, activity_type, souls_won, members_visited, calls_made, location, comments, photos, created_at)
// - scriptures (id, title, reference, category, content, notes, created_by, created_at)
// - activities (id, profile_id, type, description, created_at)
