'use client'

import { useNavigation } from '@/hooks/useNavigation'
import { DashboardContent } from '@/components/content/DashboardContent'
import { IdeasContent } from '@/components/content/IdeasContent'
import { AIOptimizeContent } from '@/components/content/AIOptimizeContent'
import { ProjectsContent } from '@/components/content/ProjectsContent'
import { TemplatesContent } from '@/components/content/TemplatesContent'
import { ChatContent } from '@/components/content/ChatContent'

export default function Home() {
  const { currentPage } = useNavigation()

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />
      case 'ideas':
        return <IdeasContent />
      case 'ai-optimize':
        return <AIOptimizeContent />
      case 'projects':
        return <ProjectsContent />
      case 'templates':
        return <TemplatesContent />
      case 'chat':
        return <ChatContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="animate-fadeIn">
      {renderContent()}
    </div>
  )
}