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
      orbit_support_credentials: {
        Row: {
          id: string
          created_at: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          payment_status: string
          supporter_name: string | null
          supporter_email: string
          display_name: string
          is_anonymous: boolean
          amount_aud: number
          currency: string
          support_message: string | null
          credential_code: string
          season_label: string | null
          project_slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          payment_status?: string
          supporter_name?: string | null
          supporter_email: string
          display_name: string
          is_anonymous?: boolean
          amount_aud: number
          currency?: string
          support_message?: string | null
          credential_code: string
          season_label?: string | null
          project_slug?: string
        }
        Update: {
          id?: string
          created_at?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          payment_status?: string
          supporter_name?: string | null
          supporter_email?: string
          display_name?: string
          is_anonymous?: boolean
          amount_aud?: number
          currency?: string
          support_message?: string | null
          credential_code?: string
          season_label?: string | null
          project_slug?: string
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
      pyadra_observers: {
        Row: {
          id: number
          created_at: string
          user_agent: string | null
          first_visit: string
        }
        Insert: {
          id?: number
          created_at?: string
          user_agent?: string | null
          first_visit?: string
        }
        Update: {
          id?: number
          created_at?: string
          user_agent?: string | null
          first_visit?: string
        }
      }
      pyadra_settings: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string
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
