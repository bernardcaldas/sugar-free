export interface DailyLog {
  id: string
  user_id: string
  date: string // 'YYYY-MM-DD'
  success: boolean
  note?: string
  is_ticket?: boolean
  is_flexible?: boolean
  mood?: string
  trigger?: string
  created_at: string
  updated_at: string
}

export type MoodType = 'excited' | 'peaceful' | 'neutral' | 'tired'
export type TriggerType = 'boredom' | 'stress' | 'social' | 'work' | 'hunger' | 'craving'

export interface User {
  id: string
  email: string
}

export interface Stats {
  currentStreak: number
  monthPercentage: number
  longestStreak: number
}
