import { SITE_CREATOR, SITE_NAME } from '../lib/site'
import { cn } from '../lib/cn'

type Props = {
  /** 桌面左栏：紧凑样式并贴底 */
  variant?: 'page' | 'sidebar'
}

export function Footer({ variant = 'page' }: Props) {
  const year = new Date().getFullYear()
  const isSidebar = variant === 'sidebar'

  return (
    <footer
      className={cn(
        'text-stone-500',
        isSidebar
          ? 'mt-auto shrink-0 rounded-lg border border-stone-200/80 bg-white px-3 py-3 text-xs leading-relaxed'
          : 'mt-12 border-t border-stone-200/80 pt-6 text-center text-xs leading-relaxed sm:mt-16',
      )}
    >
      <p className={cn(isSidebar ? 'text-stone-600' : 'text-stone-500')}>
        © {year} {SITE_NAME}
      </p>
      <p className="mt-1.5">
        <span className="text-stone-400">Creator · </span>
        <a
          href={SITE_CREATOR.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-700 underline underline-offset-[3px] transition-[color,font-style] duration-150 hover:text-blue-900 hover:italic focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-1"
        >
          {SITE_CREATOR.name}
        </a>
      </p>
    </footer>
  )
}
