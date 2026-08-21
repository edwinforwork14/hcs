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
      user_profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
