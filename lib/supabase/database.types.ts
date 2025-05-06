export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      idea_tags: {
        Row: {
          idea_id: string
          tag_id: number
        }
        Insert: {
          idea_id: string
          tag_id: number
        }
        Update: {
          idea_id?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "idea_tags_idea_id_fkey"
            columns: ["idea_id"]
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_tech_stacks: {
        Row: {
          idea_id: string
          tech_stack_id: number
        }
        Insert: {
          idea_id: string
          tech_stack_id: number
        }
        Update: {
          idea_id?: string
          tech_stack_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "idea_tech_stacks_idea_id_fkey"
            columns: ["idea_id"]
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_tech_stacks_tech_stack_id_fkey"
            columns: ["tech_stack_id"]
            referencedRelation: "tech_stacks"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          id: string
          title: string
          short_description: string
          full_description: string
          difficulty: string
          upvotes: number
          status: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          short_description: string
          full_description: string
          difficulty: string
          upvotes?: number
          status?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          short_description?: string
          full_description?: string
          difficulty?: string
          upvotes?: number
          status?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          id: string
          idea_id: string
          user_id: string
          reason: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          user_id: string
          reason: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          user_id?: string
          reason?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_idea_id_fkey"
            columns: ["idea_id"]
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: number
          name: string
          color: string
        }
        Insert: {
          id?: number
          name: string
          color?: string
        }
        Update: {
          id?: number
          name?: string
          color?: string
        }
        Relationships: []
      }
      tech_stacks: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_votes: {
        Row: {
          user_id: string
          idea_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          idea_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          idea_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_votes_idea_id_fkey"
            columns: ["idea_id"]
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_votes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
