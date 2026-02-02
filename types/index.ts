export interface DailyLog {
  id: string
  user_id: string
  date: string // 'YYYY-MM-DD'
  success: boolean
  note?: string
  is_ticket?: boolean
  is_flexible?: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
}

export interface Stats {
  currentStreak: number
  monthPercentage: number
  longestStreak: number
}
