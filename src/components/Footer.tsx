import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-16 rounded-2xl border border-stone-200/60 bg-white/50 px-5 py-6 text-sm text-stone-500 backdrop-blur-sm">
      <div className="flex gap-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" strokeWidth={1.75} />
        <div>
          <p className="leading-relaxed">
            <span className="font-medium text-stone-600">免责声明：</span>
            本站内容为基于公开资料与常识整理的人生阶段参考，不构成医疗、法律或投资建议。个体差异极大，请以自身情况与专业人士意见为准。
          </p>
          <p className="mt-3 text-xs text-stone-400">时光窗口 MVP v0.1</p>
        </div>
      </div>
    </footer>
  )
}
