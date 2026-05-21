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

/** 分类仅通过图标/灰标签区分，不着色 */
export const CATEGORY_ICON_BOX =
  'bg-white/90 text-stone-600 ring-1 ring-stone-200/80 shadow-sm'

export const CATEGORY_TAG_CLASS =
  'inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 font-medium text-stone-600 ring-1 ring-stone-200/80'

/** 筛选条：类别 chip 统一石墨色 */
export const FILTER_CHIP_CLASS = {
  inactive: 'bg-stone-50 text-stone-600 ring-stone-200/80 hover:bg-stone-100',
  active: 'bg-stone-800 text-white ring-stone-800 shadow-sm',
} as const

/** 卡片四色：按窗口状态（开放 / 将关 / 未来 / 已关） */
export const STATUS_CARD_STYLES: Record<
  WindowStatus,
  {
    bg: string
    border: string
    iconBg: string
    ring: string
    badge: string
    dot: string
    label: string
    title: string
    body: string
  }
> = {
  open: {
    bg: 'bg-emerald-50/85',
    border: 'border-l-emerald-500',
    iconBg: CATEGORY_ICON_BOX,
    ring: 'ring-emerald-400/55',
    badge: 'bg-white/80 text-emerald-800 ring-1 ring-emerald-200/70',
    dot: 'bg-emerald-500',
    label: '窗口开放',
    title: 'text-stone-900',
    body: 'text-stone-600',
  },
  closing: {
    bg: 'bg-orange-50/85',
    border: 'border-l-orange-500',
    iconBg: CATEGORY_ICON_BOX,
    ring: 'ring-orange-400/55',
    badge: 'bg-white/80 text-orange-900 ring-1 ring-orange-200/70',
    dot: 'bg-orange-500',
    label: '即将关闭',
    title: 'text-stone-900',
    body: 'text-stone-600',
  },
  upcoming: {
    bg: 'bg-blue-50/85',
    border: 'border-l-blue-500',
    iconBg: CATEGORY_ICON_BOX,
    ring: 'ring-blue-400/55',
    badge: 'bg-white/80 text-blue-800 ring-1 ring-blue-200/70',
    dot: 'bg-blue-500',
    label: '尚未到来',
    title: 'text-stone-900',
    body: 'text-stone-600',
  },
  closed: {
    bg: 'bg-stone-50',
    border: 'border-l-stone-400',
    iconBg: 'bg-stone-200 text-stone-500',
    ring: 'ring-stone-400/50',
    badge: 'bg-stone-100 text-stone-500 ring-1 ring-stone-200/80',
    dot: 'bg-stone-400',
    label: '已基本关闭',
    title: 'text-stone-600',
    body: 'text-stone-400',
  },
}

/** 已关卡片整体灰显（在状态色之上叠加） */
export const CLOSED_CARD_OVERLAY = 'opacity-90 grayscale' as const

export const SECTION_STYLES: Record<
  WindowStatus,
  { accent: string; iconBg: string; dot: string }
> = {
  open: {
    accent: 'text-emerald-800',
    iconBg: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  closing: {
    accent: 'text-orange-900',
    iconBg: 'bg-orange-100 text-orange-800',
    dot: 'bg-orange-500',
  },
  closed: {
    accent: 'text-stone-600',
    iconBg: 'bg-stone-100 text-stone-500',
    dot: 'bg-stone-400',
  },
  upcoming: {
    accent: 'text-blue-800',
    iconBg: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
}
