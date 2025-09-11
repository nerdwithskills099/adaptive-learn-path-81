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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessment_responses: {
        Row: {
          assessment_id: string
          created_at: string | null
          id: string
          is_correct: boolean
          question_id: string
          selected_answer: number
          time_taken: number | null
        }
        Insert: {
          assessment_id: string
          created_at?: string | null
          id?: string
          is_correct: boolean
          question_id: string
          selected_answer: number
          time_taken?: number | null
        }
        Update: {
          assessment_id?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_answer?: number
          time_taken?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment_type: string
          completed_at: string | null
          correct_answers: number | null
          current_level: number | null
          id: string
          is_completed: boolean | null
          skill_scores: Json | null
          started_at: string | null
          student_id: string
          total_questions: number | null
        }
        Insert: {
          assessment_type?: string
          completed_at?: string | null
          correct_answers?: number | null
          current_level?: number | null
          id?: string
          is_completed?: boolean | null
          skill_scores?: Json | null
          started_at?: string | null
          student_id: string
          total_questions?: number | null
        }
        Update: {
          assessment_type?: string
          completed_at?: string | null
          correct_answers?: number | null
          current_level?: number | null
          id?: string
          is_completed?: boolean | null
          skill_scores?: Json | null
          started_at?: string | null
          student_id?: string
          total_questions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          completed_at: string | null
          correct_answers: number | null
          difficulty_level: string | null
          id: string
          is_completed: boolean | null
          practice_mode: string
          questions_completed: number | null
          started_at: string | null
          student_id: string
          target_skills: string[] | null
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number | null
          difficulty_level?: string | null
          id?: string
          is_completed?: boolean | null
          practice_mode: string
          questions_completed?: number | null
          started_at?: string | null
          student_id: string
          target_skills?: string[] | null
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number | null
          difficulty_level?: string | null
          id?: string
          is_completed?: boolean | null
          practice_mode?: string
          questions_completed?: number | null
          started_at?: string | null
          student_id?: string
          target_skills?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          class_grade: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          interested_subjects: string[] | null
          language_preference: string | null
          parent_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          roll_number: string | null
          school_name: string | null
          teacher_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          class_grade?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          interested_subjects?: string[] | null
          language_preference?: string | null
          parent_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          roll_number?: string | null
          school_name?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          class_grade?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          interested_subjects?: string[] | null
          language_preference?: string | null
          parent_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          roll_number?: string | null
          school_name?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          chapter: string | null
          correct_answer: number
          created_at: string | null
          difficulty: string
          id: string
          options: Json
          skill: string
          subject: string
          text: string
        }
        Insert: {
          chapter?: string | null
          correct_answer: number
          created_at?: string | null
          difficulty: string
          id?: string
          options: Json
          skill: string
          subject: string
          text: string
        }
        Update: {
          chapter?: string | null
          correct_answer?: number
          created_at?: string | null
          difficulty?: string
          id?: string
          options?: Json
          skill?: string
          subject?: string
          text?: string
        }
        Relationships: []
      }
      "student database": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "student" | "teacher" | "parent"
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
    Enums: {
      user_role: ["student", "teacher", "parent"],
    },
  },
} as const
