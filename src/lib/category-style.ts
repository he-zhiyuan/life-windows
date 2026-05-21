import type { Category, WindowStatus } from '../types'
import {
  Briefcase,
  GraduationCap,
  Heart,
  Languages,
  MapPin,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  language: Languages,
  education: GraduationCap,
  location: MapPin,
  health: Heart,
  career: Briefcase,
  relationship: Users,
  finance: Wallet,
}

export const STATUS_STYLES: Record<
  WindowStatus,
  { ring: string; badge: string; dot: string; label: string }
> = {
  open: {
    ring: 'ring-emerald-500/20',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    label: '窗口开放',
  },
  closing: {
    ring: 'ring-amber-500/25',
    badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dot: 'bg-amber-500',
    label: '即将关闭',
  },
  closed: {
    ring: 'ring-stone-300/60',
    badge: 'bg-stone-100 text-stone-600 border-stone-200/80',
    dot: 'bg-stone-400',
    label: '已基本关闭',
  },
  upcoming: {
    ring: 'ring-sky-500/20',
    badge: 'bg-sky-50 text-sky-700 border-sky-200/80',
    dot: 'bg-sky-500',
    label: '尚未到来',
  },
}

export const SECTION_STYLES: Record<
  WindowStatus,
  { accent: string; iconBg: string }
> = {
  open: { accent: 'text-emerald-700', iconBg: 'bg-emerald-100 text-emerald-600' },
  closing: { accent: 'text-amber-800', iconBg: 'bg-amber-100 text-amber-600' },
  closed: { accent: 'text-stone-600', iconBg: 'bg-stone-200 text-stone-500' },
  upcoming: { accent: 'text-sky-700', iconBg: 'bg-sky-100 text-sky-600' },
}
