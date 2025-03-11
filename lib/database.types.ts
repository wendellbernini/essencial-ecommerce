export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      reviews: {
        Row: {
          id: number;
          product_id: number;
          user_id: string;
          rating: number;
          title: string;
          comment: string;
          created_at: string;
          helpful_count: number;
          reported_count: number;
          is_verified_purchase: boolean;
        };
        Insert: {
          id?: number;
          product_id: number;
          user_id: string;
          rating: number;
          title: string;
          comment: string;
          created_at?: string;
          helpful_count?: number;
          reported_count?: number;
          is_verified_purchase?: boolean;
        };
        Update: {
          id?: number;
          product_id?: number;
          user_id?: string;
          rating?: number;
          title?: string;
          comment?: string;
          created_at?: string;
          helpful_count?: number;
          reported_count?: number;
          is_verified_purchase?: boolean;
        };
      };
      // Adicione outras tabelas conforme necessário
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
