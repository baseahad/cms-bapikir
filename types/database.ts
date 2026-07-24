export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DbEnum<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
export type Row<T extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])> = Database["public"]["Tables"][T]["Row"];
export type InsertDto<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          completion_tokens: number
          created_at: string
          id: string
          model: string
          prompt_tokens: number
          provider: string
          user_id: string
        }
        Insert: {
          completion_tokens?: number
          created_at?: string
          id?: string
          model: string
          prompt_tokens?: number
          provider: string
          user_id: string
        }
        Update: {
          completion_tokens?: number
          created_at?: string
          id?: string
          model?: string
          prompt_tokens?: number
          provider?: string
          user_id?: string
        }
        Relationships: []
      }
      arc_entries: {
        Row: {
          arc_id: string
          content: string | null
          created_at: string | null
          day: number | null
          id: string
          media_urls: string[] | null
          month: number | null
          sort_order: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          year: number
        }
        Insert: {
          arc_id: string
          content?: string | null
          created_at?: string | null
          day?: number | null
          id?: string
          media_urls?: string[] | null
          month?: number | null
          sort_order?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          year: number
        }
        Update: {
          arc_id?: string
          content?: string | null
          created_at?: string | null
          day?: number | null
          id?: string
          media_urls?: string[] | null
          month?: number | null
          sort_order?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "arc_entries_arc_id_fkey"
            columns: ["arc_id"]
            isOneToOne: false
            referencedRelation: "arcs"
            referencedColumns: ["id"]
          },
        ]
      }
      arcs: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "arcs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          actor_email: string
          actor_user_id: string | null
          created_at: string
          description: string
          id: string
          metadata: Json | null
          type: string
        }
        Insert: {
          actor_email: string
          actor_user_id?: string | null
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          type: string
        }
        Update: {
          actor_email?: string
          actor_user_id?: string | null
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          type?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          access: string | null
          author: string | null
          category: string | null
          content: string
          cover_image: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          published: boolean | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          access?: string | null
          author?: string | null
          category?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          access?: string | null
          author?: string | null
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      child_milestones: {
        Row: {
          child_id: string
          created_at: string | null
          description: string | null
          event_date: string | null
          id: string
          media_urls: string[] | null
          phase: string
          sort_order: number | null
          title: string
        }
        Insert: {
          child_id: string
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          media_urls?: string[] | null
          phase: string
          sort_order?: number | null
          title: string
        }
        Update: {
          child_id?: string
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          media_urls?: string[] | null
          phase?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_milestones_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          bio: string | null
          birth_date: string | null
          created_at: string | null
          id: string
          name: string
          photo_url: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          id?: string
          name: string
          photo_url?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      koin_ledger: {
        Row: {
          created_at: string
          id: string
          keterangan: string | null
          mutasi: number
          produk: string | null
          saldo_setelah: number
          tipe: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          keterangan?: string | null
          mutasi: number
          produk?: string | null
          saldo_setelah: number
          tipe: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          keterangan?: string | null
          mutasi?: number
          produk?: string | null
          saldo_setelah?: number
          tipe?: string
          user_id?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          filename: string
          height: number | null
          id: string
          mime_type: string
          original_name: string
          size_bytes: number
          storage_path: string
          user_id: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          filename: string
          height?: number | null
          id?: string
          mime_type: string
          original_name: string
          size_bytes: number
          storage_path: string
          user_id: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string
          original_name?: string
          size_bytes?: number
          storage_path?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string | null
          payment_provider: string | null
          product_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          payment_provider?: string | null
          product_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string | null
          payment_provider?: string | null
          product_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          bank: string | null
          bukti_path: string | null
          created_at: string
          currency: string
          external_id: string
          id: string
          items: Json
          metadata: Json | null
          nama_pengirim: string | null
          paid_at: string | null
          payment_type: string | null
          plan: Database["public"]["Enums"]["plan"]
          provider: Database["public"]["Enums"]["payment_provider"]
          status: Database["public"]["Enums"]["payment_status"]
          subscription_id: string | null
          tanggal_transfer: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          bank?: string | null
          bukti_path?: string | null
          created_at?: string
          currency?: string
          external_id: string
          id?: string
          items?: Json
          metadata?: Json | null
          nama_pengirim?: string | null
          paid_at?: string | null
          payment_type?: string | null
          plan?: Database["public"]["Enums"]["plan"]
          provider: Database["public"]["Enums"]["payment_provider"]
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          tanggal_transfer?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank?: string | null
          bukti_path?: string | null
          created_at?: string
          currency?: string
          external_id?: string
          id?: string
          items?: Json
          metadata?: Json | null
          nama_pengirim?: string | null
          paid_at?: string | null
          payment_type?: string | null
          plan?: Database["public"]["Enums"]["plan"]
          provider?: Database["public"]["Enums"]["payment_provider"]
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          tanggal_transfer?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      pembelian: {
        Row: {
          created_at: string
          id: string
          koin_terpakai: number
          produk_id: string
          tipe_koin: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          koin_terpakai: number
          produk_id: string
          tipe_koin: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          koin_terpakai?: number
          produk_id?: string
          tipe_koin?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pembelian_produk_id_fkey"
            columns: ["produk_id"]
            isOneToOne: false
            referencedRelation: "produk"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          price: number
          slug: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price: number
          slug: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price?: number
          slug?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      produk: {
        Row: {
          created_at: string
          deskripsi: string | null
          harga_koin: number
          id: string
          koin_tipe: string
          nama: string
          slug: string
          status: string | null
          tipe: string
          updated_at: string
          url_konten: string | null
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          harga_koin?: number
          id?: string
          koin_tipe?: string
          nama: string
          slug: string
          status?: string | null
          tipe: string
          updated_at?: string
          url_konten?: string | null
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          harga_koin?: number
          id?: string
          koin_tipe?: string
          nama?: string
          slug?: string
          status?: string | null
          tipe?: string
          updated_at?: string
          url_konten?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          sapaan: string
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          sapaan?: string
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          sapaan?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_buckets: {
        Row: {
          count: number
          created_at: string
          namespace: string
          reset_at: string
          subject_key: string
          updated_at: string
        }
        Insert: {
          count?: number
          created_at?: string
          namespace: string
          reset_at: string
          subject_key: string
          updated_at?: string
        }
        Update: {
          count?: number
          created_at?: string
          namespace?: string
          reset_at?: string
          subject_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: Database["public"]["Enums"]["plan"]
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          wa: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          wa?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          wa?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          error_message: string | null
          event_key: string
          event_type: string
          external_id: string
          id: string
          payload: Json
          processed_at: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          status: Database["public"]["Enums"]["webhook_event_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_key: string
          event_type: string
          external_id: string
          id?: string
          payload: Json
          processed_at?: string | null
          provider: Database["public"]["Enums"]["payment_provider"]
          status?: Database["public"]["Enums"]["webhook_event_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_key?: string
          event_type?: string
          external_id?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          status?: Database["public"]["Enums"]["webhook_event_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_payment_metrics: {
        Args: never
        Returns: {
          active_subscriptions: number
          free_subscriptions: number
          paid_subscriptions: number
          total_payments: number
          total_revenue: number
        }[]
      }
      admin_revenue_by_day: {
        Args: { days_back?: number }
        Returns: {
          date: string
          revenue: number
        }[]
      }
      beli_produk: {
        Args: {
          p_harga_koin: number
          p_koin_tipe: string
          p_produk_id: string
          p_produk_slug: string
          p_user_id: string
        }
        Returns: Json
      }
      claim_webhook_event: {
        Args: {
          p_event_key: string
          p_event_type: string
          p_external_id: string
          p_payload: Json
          p_provider: Database["public"]["Enums"]["payment_provider"]
        }
        Returns: {
          created_at: string
          error_message: string
          event_key: string
          event_type: string
          external_id: string
          id: string
          payload: Json
          processed_at: string
          provider: Database["public"]["Enums"]["payment_provider"]
          should_process: boolean
          status: Database["public"]["Enums"]["webhook_event_status"]
          updated_at: string
        }[]
      }
      consume_rate_limit: {
        Args: {
          p_limit: number
          p_namespace: string
          p_subject_key: string
          p_window_seconds: number
        }
        Returns: {
          allowed: boolean
          limit: number
          remaining: number
          reset_at: string
          retry_after: number
        }[]
      }
    }
    Enums: {
      app_role: "member" | "admin"
      payment_provider: "MIDTRANS" | "DOKU" | "MANUAL"
      payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "EXPIRED"
      plan: "FREE" | "BASIC" | "PRO" | "ULTIMATE"
      subscription_status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID"
      webhook_event_status: "processing" | "processed" | "failed"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["member", "admin"],
      payment_provider: ["MIDTRANS", "DOKU", "MANUAL"],
      payment_status: ["PENDING", "PAID", "FAILED", "REFUNDED", "EXPIRED"],
      plan: ["FREE", "BASIC", "PRO", "ULTIMATE"],
      subscription_status: ["ACTIVE", "CANCELED", "PAST_DUE", "UNPAID"],
      webhook_event_status: ["processing", "processed", "failed"],
    },
  },
} as const
