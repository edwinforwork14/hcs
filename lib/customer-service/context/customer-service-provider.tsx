'use client'

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import type { CustomerServiceConfig } from '../config'
import { createSupabaseConfig } from '../adapters/supabase'
import { ChatService, ConversationService, MessageService, PresenceService } from '../core/services'
import { DEFAULT_TRANSLATIONS } from '../i18n'
import type { Language } from '../i18n'
import { DEFAULT_THEME } from '../theme'

interface CustomerServiceContextProps {
  config: CustomerServiceConfig
  services: {
    chat: ChatService
    conversation: ConversationService
    message: MessageService
    presence: PresenceService
  }
  anonServices: {
    chat: ChatService
    conversation: ConversationService
    message: MessageService
    presence: PresenceService
  }
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const CustomerServiceContext = createContext<CustomerServiceContextProps | undefined>(undefined)

interface CustomerServiceProviderProps {
  config?: CustomerServiceConfig
  children: ReactNode
}

export function CustomerServiceProvider({
  config: providedConfig,
  children,
}: CustomerServiceProviderProps) {
  const config = useMemo(() => providedConfig ?? createSupabaseConfig(), [providedConfig])
  const [language, setLanguage] = useState<Language>(config.defaultLanguage || 'en')

  const { services, anonServices } = useMemo(() => {
    const chat = new ChatService(config.repositories)
    const conversation = new ConversationService(config.repositories)
    const message = new MessageService(config.repositories)
    const presence = new PresenceService(config.providers.presence)

    let anonChat = chat
    let anonConversation = conversation
    let anonMessage = message

    if (config.anonRepositories) {
      const anonRepos = {
        conversation: config.anonRepositories.conversation,
        message: config.anonRepositories.message,
        customer: config.anonRepositories.customer,
        attachment: config.anonRepositories.attachment,
      }
      anonChat = new ChatService(anonRepos)
      anonConversation = new ConversationService(anonRepos)
      anonMessage = new MessageService(anonRepos)
    }

    return {
      services: { chat, conversation, message, presence },
      anonServices: { chat: anonChat, conversation: anonConversation, message: anonMessage, presence },
    }
  }, [config])

  const t = (key: string): string => {
    const custom = config.translations?.[language]?.[key]
    if (custom) return custom
    const fallback = DEFAULT_TRANSLATIONS[language]?.[key]
    return fallback || key
  }

  const theme = useMemo(() => {
    return {
      ...DEFAULT_THEME,
      ...config.theme,
    }
  }, [config.theme])

  const themeStyles = useMemo(() => {
    return {
      '--cs-primary': theme.primaryColor,
      '--cs-secondary': theme.secondaryColor,
    } as React.CSSProperties
  }, [theme])

  return (
    <CustomerServiceContext.Provider
      value={{
        config,
        services,
        anonServices,
        language,
        setLanguage,
        t,
      }}
    >
      <div style={themeStyles} className="contents cs-theme-wrapper">
        {children}
      </div>
    </CustomerServiceContext.Provider>
  )
}

export function useCustomerService() {
  const context = useContext(CustomerServiceContext)
  if (!context) {
    throw new Error('useCustomerService must be used within a CustomerServiceProvider')
  }
  return context
}
