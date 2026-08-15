'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useLanguage } from '@/context/language-context'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  StartConversationSchema,
  type StartConversationInput,
} from '@/lib/validations/chat'

interface ChatStartFormProps {
  onStart: (input: StartConversationInput) => Promise<void>
}

export function ChatStartForm({ onStart }: ChatStartFormProps) {
  const { t } = useLanguage()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<StartConversationInput>({
    resolver: zodResolver(StartConversationSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
    },
  })

  const handleSubmit = async (values: StartConversationInput) => {
    setSubmitting(true)
    try {
      await onStart(values)
    } catch {
      toast.error(t('chat.startError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold">{t('chat.startTitle')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('chat.startSubtitle')}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('chat.name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={submitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('chat.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    disabled={submitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('chat.phone')}</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 555 000 0000"
                    autoComplete="tel"
                    disabled={submitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full cursor-pointer bg-gradient-to-r from-[#D90429] to-[#FF4D6A] hover:from-[#B80324] hover:to-[#D90429]"
          >
            {submitting ? t('chat.starting') : t('chat.start')}
          </Button>
        </form>
      </Form>
    </div>
  )
}
