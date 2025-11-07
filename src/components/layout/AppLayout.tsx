'use client'

import { MainNavigation } from './MainNavigation'
import { useNavigation } from '@/hooks/useNavigation'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { currentPage } = useNavigation()

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main className="container mx-auto px-4 py-6">
        <div className="transition-all duration-300 ease-in-out">
          {children}
        </div>
      </main>
    </div>
  )
}