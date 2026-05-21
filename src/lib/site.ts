/** 站点与作者信息（页脚等） */
export const SITE_CREATOR = {
  name: '何致远',
  url: 'https://hezhiyuan.me',
} as const

export const SITE_NAME = '时光窗口'

/** 运行时向控制台输出页脚文案（与 Footer 一致） */
export function logSiteFooterToConsole(): void {
  const year = new Date().getFullYear()
  const text = `© ${year} ${SITE_NAME}\nCreator · ${SITE_CREATOR.name} — ${SITE_CREATOR.url}`
  console.log(`[${SITE_NAME}]\n${text}`)
}
