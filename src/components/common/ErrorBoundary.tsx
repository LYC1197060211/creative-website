'use client'

import { Component, ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="mb-4">
              <div className="text-6xl mb-4">😵</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                出现了一些问题
              </h1>
              <p className="text-gray-600 mb-4">
                应用遇到了一个意外错误，请刷新页面重试
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-4 p-3 bg-red-50 rounded border border-red-200">
                  <summary className="text-sm font-medium text-red-800 cursor-pointer">
                    错误详情
                  </summary>
                  <pre className="mt-2 text-xs text-red-700 overflow-auto">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                刷新页面
              </Button>
              <Button
                variant="secondary"
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="flex-1"
              >
                重试
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}