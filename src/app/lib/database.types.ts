// Database type definitions for Supabase
// Generated from Supabase schema - update as schema evolves

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Database {
  public: {
    Tables: {
      orbit_supporters: {
        Row: {
          id: string
          created_at: string
          stripe_customer_id: string | null
          stripe_session_id: string
          supporter_name: string
          supporter_email: string
          amount_aud: number
          season_label: string
          credential_code: string
        }
        Insert: {
          id?: string
          created_at?: string
          stripe_customer_id?: string | null
          stripe_session_id: string
          supporter_name: string
          supporter_email: string
          amount_aud: number
          season_label: string
          credential_code: string
        }
        Update: {
          id?: string
          created_at?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string
          supporter_name?: string
          supporter_email?: string
          amount_aud?: number
          season_label?: string
          credential_code?: string
        }
      }
      ethernicapsule_capsules: {
        Row: {
          id: string
          created_at: string
          status: 'pending' | 'sealed' | 'delivered' | 'cancelled'
          stripe_session_id: string
          sender_name: string
          sender_email: string
          recipient_name: string | null
          guardian_email: string | null
          deliver_at: string | null
          message: string
          sender_key_hash: string
          capsule_key_hash: string
          delivered_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          status?: 'pending' | 'sealed' | 'delivered' | 'cancelled'
          stripe_session_id: string
          sender_name: string
          sender_email: string
          recipient_name?: string | null
          guardian_email?: string | null
          deliver_at?: string | null
          message: string
          sender_key_hash: string
          capsule_key_hash: string
          delivered_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          status?: 'pending' | 'sealed' | 'delivered' | 'cancelled'
          stripe_session_id?: string
          sender_name?: string
          sender_email?: string
          recipient_name?: string | null
          guardian_email?: string | null
          deliver_at?: string | null
          message?: string
          sender_key_hash?: string
          capsule_key_hash?: string
          delivered_at?: string | null
        }
      }
      observers: {
        Row: {
          id: number
          created_at: string
        }
        Insert: {
          id?: number
          created_at?: string
        }
        Update: {
          id?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
