export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bible_books: {
        Row: {
          chapters_count: number
          created_at: string
          id: string
          name: string
          number: number
          testament: string
        }
        Insert: {
          chapters_count: number
          created_at?: string
          id?: string
          name: string
          number: number
          testament: string
        }
        Update: {
          chapters_count?: number
          created_at?: string
          id?: string
          name?: string
          number?: number
          testament?: string
        }
        Relationships: []
      }
      bible_translations: {
        Row: {
          code: string
          created_at: string
          id: string
          language: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          language?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          language?: string
          name?: string
        }
        Relationships: []
      }
      bible_verses: {
        Row: {
          book_id: string
          chapter: number
          created_at: string
          id: string
          text: string
          translation_id: string
          verse: number
        }
        Insert: {
          book_id: string
          chapter: number
          created_at?: string
          id?: string
          text: string
          translation_id: string
          verse: number
        }
        Update: {
          book_id?: string
          chapter?: number
          created_at?: string
          id?: string
          text?: string
          translation_id?: string
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_verses_translation_id_fkey"
            columns: ["translation_id"]
            isOneToOne: false
            referencedRelation: "bible_translations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_devotionals: {
        Row: {
          book_id: string | null
          chapter: number | null
          content: string
          created_at: string
          date: string
          id: string
          title: string
          verse: number | null
          verse_reference: string | null
        }
        Insert: {
          book_id?: string | null
          chapter?: number | null
          content: string
          created_at?: string
          date: string
          id?: string
          title: string
          verse?: number | null
          verse_reference?: string | null
        }
        Update: {
          book_id?: string | null
          chapter?: number | null
          content?: string
          created_at?: string
          date?: string
          id?: string
          title?: string
          verse?: number | null
          verse_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_devotionals_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          preferred_translation: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_translation?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_translation?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_plan_days: {
        Row: {
          book_id: string
          chapter_end: number
          chapter_start: number
          created_at: string
          day_number: number
          id: string
          plan_id: string
        }
        Insert: {
          book_id: string
          chapter_end: number
          chapter_start: number
          created_at?: string
          day_number: number
          id?: string
          plan_id: string
        }
        Update: {
          book_id?: string
          chapter_end?: number
          chapter_start?: number
          created_at?: string
          day_number?: number
          id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_days_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plans: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      reading_streaks: {
        Row: {
          chapters_read: number | null
          created_at: string
          date: string
          id: string
          user_id: string
        }
        Insert: {
          chapters_read?: number | null
          created_at?: string
          date: string
          id?: string
          user_id: string
        }
        Update: {
          chapters_read?: number | null
          created_at?: string
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          book_id: string
          chapter: number
          created_at: string
          id: string
          title: string | null
          user_id: string
          verse: number
        }
        Insert: {
          book_id: string
          chapter: number
          created_at?: string
          id?: string
          title?: string | null
          user_id: string
          verse: number
        }
        Update: {
          book_id?: string
          chapter?: number
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      user_highlights: {
        Row: {
          book_id: string
          chapter: number
          color: string
          created_at: string
          id: string
          user_id: string
          verse: number
        }
        Insert: {
          book_id: string
          chapter: number
          color?: string
          created_at?: string
          id?: string
          user_id: string
          verse: number
        }
        Update: {
          book_id?: string
          chapter?: number
          color?: string
          created_at?: string
          id?: string
          user_id?: string
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_highlights_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          book_id: string
          chapter: number
          color: string | null
          created_at: string
          id: string
          note_text: string
          updated_at: string
          user_id: string
          verse: number | null
        }
        Insert: {
          book_id: string
          chapter: number
          color?: string | null
          created_at?: string
          id?: string
          note_text: string
          updated_at?: string
          user_id: string
          verse?: number | null
        }
        Update: {
          book_id?: string
          chapter?: number
          color?: string | null
          created_at?: string
          id?: string
          note_text?: string
          updated_at?: string
          user_id?: string
          verse?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
