export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      configuracoes: {
        Row: {
          chave: string
          created_at: string
          empreendimento_id: string
          id: string
          updated_at: string
          valor: string | null
        }
        Insert: {
          chave: string
          created_at?: string
          empreendimento_id: string
          id?: string
          updated_at?: string
          valor?: string | null
        }
        Update: {
          chave?: string
          created_at?: string
          empreendimento_id?: string
          id?: string
          updated_at?: string
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_sistema: {
        Row: {
          atualizado_em: string
          categoria: string | null
          chave: string
          criado_em: string
          descricao: string | null
          id: string
          valor: string | null
          visivel_admin_apenas: boolean | null
        }
        Insert: {
          atualizado_em?: string
          categoria?: string | null
          chave: string
          criado_em?: string
          descricao?: string | null
          id?: string
          valor?: string | null
          visivel_admin_apenas?: boolean | null
        }
        Update: {
          atualizado_em?: string
          categoria?: string | null
          chave?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          valor?: string | null
          visivel_admin_apenas?: boolean | null
        }
        Relationships: []
      }
      empreendimentos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          imagem_url: string | null
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      equipes: {
        Row: {
          created_at: string
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          corretor_id: string | null
          created_at: string
          email: string | null
          equipe_id: string | null
          id: string
          nome: string
          observacoes: string | null
          origem: string | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          corretor_id?: string | null
          created_at?: string
          email?: string | null
          equipe_id?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          origem?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          corretor_id?: string | null
          created_at?: string
          email?: string | null
          equipe_id?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          origem?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_corretor_id_fkey"
            columns: ["corretor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      marcadores: {
        Row: {
          created_at: string
          empreendimento_id: string
          id: string
          lote: string
          quadra: string
          tamanho: number | null
          updated_at: string
          x: number
          y: number
        }
        Insert: {
          created_at?: string
          empreendimento_id: string
          id?: string
          lote: string
          quadra: string
          tamanho?: number | null
          updated_at?: string
          x: number
          y: number
        }
        Update: {
          created_at?: string
          empreendimento_id?: string
          id?: string
          lote?: string
          quadra?: string
          tamanho?: number | null
          updated_at?: string
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "marcadores_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_cadastro: {
        Row: {
          aprovado_por_id: string | null
          created_at: string
          data_aprovacao: string | null
          data_solicitacao: string
          email: string
          equipe_id: string | null
          id: string
          nome: string
          observacoes: string | null
          solicitante_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          aprovado_por_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_solicitacao?: string
          email: string
          equipe_id?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          solicitante_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          aprovado_por_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_solicitacao?: string
          email?: string
          equipe_id?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          solicitante_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cadastro_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ativo: boolean
          created_at: string
          email: string | null
          equipe_id: string | null
          id: string
          nome: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          equipe_id?: string | null
          id: string
          nome?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          equipe_id?: string | null
          id?: string
          nome?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades: {
        Row: {
          area: number | null
          cliente: string | null
          created_at: string
          disponibilidade: string
          empreendimento_id: string
          id: string
          lote: string
          preco: number | null
          quadra: string
          updated_at: string
        }
        Insert: {
          area?: number | null
          cliente?: string | null
          created_at?: string
          disponibilidade: string
          empreendimento_id: string
          id?: string
          lote: string
          preco?: number | null
          quadra: string
          updated_at?: string
        }
        Update: {
          area?: number | null
          cliente?: string | null
          created_at?: string
          disponibilidade?: string
          empreendimento_id?: string
          id?: string
          lote?: string
          preco?: number | null
          quadra?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidades_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_equipe: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      user_role: "administrador" | "supervisor" | "colaborador"
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
      user_role: ["administrador", "supervisor", "colaborador"],
    },
  },
} as const
