export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          email?: string | null;
          display_name?: string | null;
          updated_at?: string | null;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          source_url: string | null;
          source_platform: string | null;
          source_author: string | null;
          source_caption: string | null;
          title: string;
          description: string | null;
          servings: number | null;
          estimated_time_minutes: number | null;
          difficulty: string | null;
          dish_type: string | null;
          calories_estimate: number | null;
          status: string;
          is_favorite: boolean;
          is_tested: boolean;
          private_notes: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_url?: string | null;
          source_platform?: string | null;
          source_author?: string | null;
          source_caption?: string | null;
          title: string;
          description?: string | null;
          servings?: number | null;
          estimated_time_minutes?: number | null;
          difficulty?: string | null;
          dish_type?: string | null;
          calories_estimate?: number | null;
          status?: string;
          is_favorite?: boolean;
          is_tested?: boolean;
          private_notes?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          source_url?: string | null;
          source_platform?: string | null;
          source_author?: string | null;
          source_caption?: string | null;
          title?: string;
          description?: string | null;
          servings?: number | null;
          estimated_time_minutes?: number | null;
          difficulty?: string | null;
          dish_type?: string | null;
          calories_estimate?: number | null;
          status?: string;
          is_favorite?: boolean;
          is_tested?: boolean;
          private_notes?: string | null;
          updated_at?: string | null;
        };
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          name: string;
          quantity: number | null;
          unit: string | null;
          raw_text: string | null;
          position: number | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          name: string;
          quantity?: number | null;
          unit?: string | null;
          raw_text?: string | null;
          position?: number | null;
        };
        Update: {
          name?: string;
          quantity?: number | null;
          unit?: string | null;
          raw_text?: string | null;
          position?: number | null;
        };
      };
      recipe_steps: {
        Row: {
          id: string;
          recipe_id: string;
          step_number: number;
          description: string;
          estimated_time_minutes: number | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          step_number: number;
          description: string;
          estimated_time_minutes?: number | null;
        };
        Update: {
          step_number?: number;
          description?: string;
          estimated_time_minutes?: number | null;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          name?: string;
        };
      };
      recipe_tags: {
        Row: {
          recipe_id: string;
          tag_id: string;
        };
        Insert: {
          recipe_id: string;
          tag_id: string;
        };
        Update: never;
      };
      processing_jobs: {
        Row: {
          id: string;
          recipe_id: string;
          status: string;
          error_message: string | null;
          raw_input: string | null;
          ai_output_json: Json | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          status?: string;
          error_message?: string | null;
          raw_input?: string | null;
          ai_output_json?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          status?: string;
          error_message?: string | null;
          raw_input?: string | null;
          ai_output_json?: Json | null;
          updated_at?: string | null;
        };
      };
    };
  };
};
