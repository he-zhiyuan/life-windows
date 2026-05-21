export type Category =
  | 'language'
  | 'education'
  | 'location'
  | 'health'
  | 'career'
  | 'relationship'
  | 'finance'

export type Importance = 'critical' | 'high' | 'medium'

export type WindowStatus = 'upcoming' | 'open' | 'closing' | 'closed'

export interface AgeWindow {
  best: [number, number]
  still: [number, number]
  closedAfter: number
}

export interface Opportunity {
  id: string
  title: string
  category: Category
  importance: Importance
  description: string
  window: AgeWindow
  alternatives: string[]
  note?: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  language: '语言',
  education: '教育',
  location: '地域',
  health: '健康',
  career: '职业',
  relationship: '关系',
  finance: '财务',
}

export const IMPORTANCE_LABELS: Record<Importance, string> = {
  critical: '关键',
  high: '重要',
  medium: '一般',
}
