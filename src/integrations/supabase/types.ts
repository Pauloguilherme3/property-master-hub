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
      arquivos_empreendimento: {
        Row: {
          categoria_arquivo_id: string | null
          created_at: string | null
          empreendimento_id: string | null
          id: string
          nome_arquivo: string
          nome_original: string
          ordem: number | null
          tamanho: number | null
          tipo_mime: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          categoria_arquivo_id?: string | null
          created_at?: string | null
          empreendimento_id?: string | null
          id?: string
          nome_arquivo: string
          nome_original: string
          ordem?: number | null
          tamanho?: number | null
          tipo_mime?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          categoria_arquivo_id?: string | null
          created_at?: string | null
          empreendimento_id?: string | null
          id?: string
          nome_arquivo?: string
          nome_original?: string
          ordem?: number | null
          tamanho?: number | null
          tipo_mime?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_empreendimento_categoria_arquivo_id_fkey"
            columns: ["categoria_arquivo_id"]
            isOneToOne: false
            referencedRelation: "categorias_arquivo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_empreendimento_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      campos_personalizados: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          nome: string
          obrigatorio: boolean | null
          opcoes: Json | null
          ordem: number | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome: string
          obrigatorio?: boolean | null
          opcoes?: Json | null
          ordem?: number | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome?: string
          obrigatorio?: boolean | null
          opcoes?: Json | null
          ordem?: number | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categorias_arquivo: {
        Row: {
          created_at: string | null
          descricao: string | null
          empreendimento_id: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          empreendimento_id?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          empreendimento_id?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_arquivo_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      cidades: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          estado: string
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          estado: string
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          estado?: string
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
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
      construtoras: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      empreendimento_categorias: {
        Row: {
          categoria_id: string
          created_at: string | null
          empreendimento_id: string
        }
        Insert: {
          categoria_id: string
          created_at?: string | null
          empreendimento_id: string
        }
        Update: {
          categoria_id?: string
          created_at?: string | null
          empreendimento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empreendimento_categorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empreendimento_categorias_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      empreendimento_cidades: {
        Row: {
          cidade_id: string
          created_at: string | null
          empreendimento_id: string
        }
        Insert: {
          cidade_id: string
          created_at?: string | null
          empreendimento_id: string
        }
        Update: {
          cidade_id?: string
          created_at?: string | null
          empreendimento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empreendimento_cidades_cidade_id_fkey"
            columns: ["cidade_id"]
            isOneToOne: false
            referencedRelation: "cidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empreendimento_cidades_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      empreendimento_construtoras: {
        Row: {
          construtora_id: string
          created_at: string | null
          empreendimento_id: string
        }
        Insert: {
          construtora_id: string
          created_at?: string | null
          empreendimento_id: string
        }
        Update: {
          construtora_id?: string
          created_at?: string | null
          empreendimento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empreendimento_construtoras_construtora_id_fkey"
            columns: ["construtora_id"]
            isOneToOne: false
            referencedRelation: "construtoras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empreendimento_construtoras_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      empreendimento_equipes: {
        Row: {
          created_at: string | null
          empreendimento_id: string
          equipe_id: string
        }
        Insert: {
          created_at?: string | null
          empreendimento_id: string
          equipe_id: string
        }
        Update: {
          created_at?: string | null
          empreendimento_id?: string
          equipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empreendimento_equipes_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empreendimento_equipes_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      empreendimento_faixas_preco: {
        Row: {
          created_at: string | null
          empreendimento_id: string
          faixa_preco_id: string
        }
        Insert: {
          created_at?: string | null
          empreendimento_id: string
          faixa_preco_id: string
        }
        Update: {
          created_at?: string | null
          empreendimento_id?: string
          faixa_preco_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empreendimento_faixas_preco_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empreendimento_faixas_preco_faixa_preco_id_fkey"
            columns: ["faixa_preco_id"]
            isOneToOne: false
            referencedRelation: "faixas_preco"
            referencedColumns: ["id"]
          },
        ]
      }
      empreendimento_segmentos: {
        Row: {
          created_at: string | null
          empreendimento_id: string
          segmento_id: string
        }
        Insert: {
          created_at?: string | null
          empreendimento_id: string
          segmento_id: string
        }
        Update: {
          created_at?: string | null
          empreendimento_id?: string
          segmento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empreendimento_segmentos_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empreendimento_segmentos_segmento_id_fkey"
            columns: ["segmento_id"]
            isOneToOne: false
            referencedRelation: "segmentos"
            referencedColumns: ["id"]
          },
        ]
      }
      empreendimentos: {
        Row: {
          codigo: string | null
          created_at: string
          descricao: string | null
          endereco_completo: string | null
          foto_capa_url: string | null
          id: string
          imagem_url: string | null
          latitude: number | null
          longitude: number | null
          metragem_max: number | null
          metragem_min: number | null
          nome: string
          status_empreendimento: string | null
          subtitulo: string | null
          titulo: string | null
          updated_at: string
        }
        Insert: {
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          endereco_completo?: string | null
          foto_capa_url?: string | null
          id?: string
          imagem_url?: string | null
          latitude?: number | null
          longitude?: number | null
          metragem_max?: number | null
          metragem_min?: number | null
          nome: string
          status_empreendimento?: string | null
          subtitulo?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          endereco_completo?: string | null
          foto_capa_url?: string | null
          id?: string
          imagem_url?: string | null
          latitude?: number | null
          longitude?: number | null
          metragem_max?: number | null
          metragem_min?: number | null
          nome?: string
          status_empreendimento?: string | null
          subtitulo?: string | null
          titulo?: string | null
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
      faixas_preco: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
          valor_max: number | null
          valor_min: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          valor_max?: number | null
          valor_min?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          valor_max?: number | null
          valor_min?: number | null
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
      reservas: {
        Row: {
          cpf_cliente: string
          created_at: string
          criado_por_id: string | null
          data_visita: string
          empreendimento_id: string
          horario: string
          id: string
          nome_cliente: string
          observacoes: string | null
          status: string
          telefone_cliente: string
          tipo_visita: string | null
          unidade_id: string
          updated_at: string
        }
        Insert: {
          cpf_cliente: string
          created_at?: string
          criado_por_id?: string | null
          data_visita: string
          empreendimento_id: string
          horario: string
          id?: string
          nome_cliente: string
          observacoes?: string | null
          status?: string
          telefone_cliente: string
          tipo_visita?: string | null
          unidade_id: string
          updated_at?: string
        }
        Update: {
          cpf_cliente?: string
          created_at?: string
          criado_por_id?: string | null
          data_visita?: string
          empreendimento_id?: string
          horario?: string
          id?: string
          nome_cliente?: string
          observacoes?: string | null
          status?: string
          telefone_cliente?: string
          tipo_visita?: string | null
          unidade_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      segmentos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
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
      valores_campos_personalizados: {
        Row: {
          campo_personalizado_id: string | null
          created_at: string | null
          empreendimento_id: string | null
          id: string
          updated_at: string | null
          valor: string | null
        }
        Insert: {
          campo_personalizado_id?: string | null
          created_at?: string | null
          empreendimento_id?: string | null
          id?: string
          updated_at?: string | null
          valor?: string | null
        }
        Update: {
          campo_personalizado_id?: string | null
          created_at?: string | null
          empreendimento_id?: string | null
          id?: string
          updated_at?: string | null
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valores_campos_personalizados_campo_personalizado_id_fkey"
            columns: ["campo_personalizado_id"]
            isOneToOne: false
            referencedRelation: "campos_personalizados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valores_campos_personalizados_empreendimento_id_fkey"
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
      is_admin_or_colab: {
        Args: { _user_id: string }
        Returns: boolean
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
