import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types для TypeScript
export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type GameProgress = {
  id: string
  user_id: string
  game_number: number
  score: number
  completed: boolean
  unlocked: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type Achievement = {
  id: string
  user_id: string
  achievement_type: string
  achievement_name: string
  achievement_description: string | null
  earned_at: string
}

export type Certificate = {
  id: string
  user_id: string
  certificate_type: string
  total_score: number
  games_completed: number
  issued_at: string
}
