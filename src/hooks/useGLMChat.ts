'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GLMChatState, ChatMessage, ChatSession } from '@/types/chat'

// 临时的简化版本，聊天功能正在开发中
export const useGLMChat = create<GLMChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      apiKey: '',
      currentMessage: '',

      setCurrentSessionId: (id) => set({ currentSessionId: id }),

      createNewSession: () => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newSession: ChatSession = {
          id: sessionId,
          title: '新对话',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: sessionId,
        }))

        return sessionId
      },

      addMessage: (sessionId, message) => {
        const newMessageId = message.id ?? `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const timestamp = message.timestamp ?? new Date()
        const newMessage: ChatMessage = {
          ...message,
          id: newMessageId,
          timestamp,
        }

        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === sessionId) {
              const updatedMessages = [...session.messages, newMessage]
              let title = session.title

              if (message.role === 'user' && session.messages.length === 0) {
                title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
              }

              return {
                ...session,
                messages: updatedMessages,
                title,
                updatedAt: new Date(),
              }
            }
            return session
          })

          return { sessions }
        })

        return newMessageId
      },

      updateMessage: (sessionId, messageId, content) => {
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id === sessionId) {
              return {
                ...session,
                messages: session.messages.map((message) => {
                  if (message.id === messageId) {
                    return { ...message, content }
                  }
                  return message
                }),
                updatedAt: new Date(),
              }
            }
            return session
          }),
        }))
      },

      deleteMessage: (sessionId, messageId) => {
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id === sessionId) {
              return {
                ...session,
                messages: session.messages.filter((message) => message.id !== messageId),
                updatedAt: new Date(),
              }
            }
            return session
          }),
        }))
      },

      deleteSession: (sessionId) => {
        set((state) => {
          const newSessions = state.sessions.filter((session) => session.id !== sessionId)
          const newCurrentSessionId = state.currentSessionId === sessionId
            ? (newSessions.length > 0 ? newSessions[0].id : null)
            : state.currentSessionId

          return {
            sessions: newSessions,
            currentSessionId: newCurrentSessionId,
          }
        })
      },

      updateSessionTitle: (sessionId, title) => {
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id === sessionId) {
              return { ...session, title, updatedAt: new Date() }
            }
            return session
          }),
        }))
      },

      setCurrentMessage: (message) => set({ currentMessage: message }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      setApiKey: (key) => set({ apiKey: key }),

      getSession: (sessionId) => {
        return get().sessions.find((session) => session.id === sessionId)
      },

      getCurrentSession: () => {
        const { currentSessionId, sessions } = get()
        if (!currentSessionId) return undefined
        return sessions.find((session) => session.id === currentSessionId)
      },
    }),
    {
      name: 'glm-chat-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
        apiKey: state.apiKey,
      }),
    }
  )
)