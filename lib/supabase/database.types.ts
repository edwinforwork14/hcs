// Typed database schema for Supabase.
// Keep in sync with supabase/schema.sql
export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string | null
          customer_location: string | null
          customer_language: string | null
          status: 'open' | 'closed'
          /** Last time an admin read the conversation. Used to compute unread counts. */
          admin_last_read_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          customer_location?: string | null
          customer_language?: string | null
          status?: 'open' | 'closed'
          admin_last_read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: 'customer' | 'admin'
          /** Plain text, or JSON {"attachment": {...}, "text": "..."} for file messages. */
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: 'customer' | 'admin'
          content: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
        ]
      }
      admins: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['admins']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
