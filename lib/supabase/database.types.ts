export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string | null
          last_name: string | null
          email: string
          phone_number: string | null
          home_org: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone_number?: string | null
          home_org: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone_number?: string | null
          home_org?: string
          avatar_url?: string | null
        }
      }
      blog_categories: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          description: string | null
          owning_org: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
          description?: string | null
          owning_org: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
          description?: string | null
          owning_org?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          published: boolean
          published_at: string | null
          featured_image: string | null
          author_id: string
          category_id: string
          views_count: number
          owning_org: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          published?: boolean
          published_at?: string | null
          featured_image?: string | null
          author_id: string
          category_id: string
          views_count?: number
          owning_org: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          published?: boolean
          published_at?: string | null
          featured_image?: string | null
          author_id?: string
          category_id?: string
          views_count?: number
          owning_org?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          message: string
          status: string
          owning_org: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string | null
          message: string
          status?: string
          owning_org: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: string
          owning_org?: string
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
