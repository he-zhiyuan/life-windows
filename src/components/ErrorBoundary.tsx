import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-50 p-8">
          <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <h1 className="font-serif text-2xl font-semibold text-stone-900">
              出了点问题
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              页面遇到了意外错误，请刷新后重试。
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 cursor-pointer rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              刷新页面
            </button>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-xs text-stone-500 hover:text-stone-700">
                  错误详情
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-stone-100 p-3 text-xs text-stone-600">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
