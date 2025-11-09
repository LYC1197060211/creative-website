import './globals.css'
import { AppLayout } from '@/components/layout/AppLayout'

export const metadata = {
  title: '创意管理系统',
  description: '个人创意收集、管理和AI优化平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans bg-gray-50 text-gray-900">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}
