-- Criar tabelas de cadastros básicos
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.cidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  estado TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.construtoras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.faixas_preco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  valor_min DECIMAL,
  valor_max DECIMAL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.segmentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de campos personalizados
CREATE TABLE public.campos_personalizados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('texto', 'numero', 'data', 'selecao', 'multipla_selecao', 'booleano')),
  opcoes JSONB, -- Para campos de seleção
  obrigatorio BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de categorias de arquivo
CREATE TABLE public.categorias_arquivo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('imagem', 'planta', 'arquivo')),
  descricao TEXT,
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Expandir tabela de empreendimentos
ALTER TABLE public.empreendimentos 
ADD COLUMN codigo TEXT,
ADD COLUMN titulo TEXT,
ADD COLUMN subtitulo TEXT,
ADD COLUMN endereco_completo TEXT,
ADD COLUMN latitude DECIMAL(10,8),
ADD COLUMN longitude DECIMAL(11,8),
ADD COLUMN metragem_min DECIMAL,
ADD COLUMN metragem_max DECIMAL,
ADD COLUMN status_empreendimento TEXT DEFAULT 'ativo',
ADD COLUMN foto_capa_url TEXT;

-- Criar tabela de arquivos do empreendimento
CREATE TABLE public.arquivos_empreendimento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  categoria_arquivo_id UUID REFERENCES public.categorias_arquivo(id),
  nome_original TEXT NOT NULL,
  nome_arquivo TEXT NOT NULL,
  url TEXT NOT NULL,
  tipo_mime TEXT,
  tamanho INTEGER,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de valores de campos personalizados
CREATE TABLE public.valores_campos_personalizados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  campo_personalizado_id UUID REFERENCES public.campos_personalizados(id) ON DELETE CASCADE,
  valor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(empreendimento_id, campo_personalizado_id)
);

-- Criar tabelas de relacionamento many-to-many
CREATE TABLE public.empreendimento_equipes (
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  equipe_id UUID REFERENCES public.equipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (empreendimento_id, equipe_id)
);

CREATE TABLE public.empreendimento_categorias (
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (empreendimento_id, categoria_id)
);

CREATE TABLE public.empreendimento_cidades (
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  cidade_id UUID REFERENCES public.cidades(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (empreendimento_id, cidade_id)
);

CREATE TABLE public.empreendimento_construtoras (
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  construtora_id UUID REFERENCES public.construtoras(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (empreendimento_id, construtora_id)
);

CREATE TABLE public.empreendimento_faixas_preco (
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  faixa_preco_id UUID REFERENCES public.faixas_preco(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (empreendimento_id, faixa_preco_id)
);

CREATE TABLE public.empreendimento_segmentos (
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  segmento_id UUID REFERENCES public.segmentos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (empreendimento_id, segmento_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construtoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faixas_preco ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.segmentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campos_personalizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_arquivo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arquivos_empreendimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valores_campos_personalizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empreendimento_equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empreendimento_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empreendimento_cidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empreendimento_construtoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empreendimento_faixas_preco ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empreendimento_segmentos ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS básicas (permitir leitura para usuários autenticados)
CREATE POLICY "Permitir leitura para autenticados" ON public.categorias FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir leitura para autenticados" ON public.cidades FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir leitura para autenticados" ON public.construtoras FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir leitura para autenticados" ON public.faixas_preco FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir leitura para autenticados" ON public.segmentos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir leitura para autenticados" ON public.campos_personalizados FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para admins/colaboradores
CREATE POLICY "Admins podem gerenciar categorias" ON public.categorias FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar cidades" ON public.cidades FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar construtoras" ON public.construtoras FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar faixas_preco" ON public.faixas_preco FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar segmentos" ON public.segmentos FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar campos_personalizados" ON public.campos_personalizados FOR ALL USING (is_admin_or_colab(auth.uid()));

-- Políticas para arquivos e relacionamentos
CREATE POLICY "Admins podem gerenciar categorias_arquivo" ON public.categorias_arquivo FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar arquivos_empreendimento" ON public.arquivos_empreendimento FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar valores_campos_personalizados" ON public.valores_campos_personalizados FOR ALL USING (is_admin_or_colab(auth.uid()));

-- Políticas para relacionamentos many-to-many
CREATE POLICY "Admins podem gerenciar empreendimento_equipes" ON public.empreendimento_equipes FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar empreendimento_categorias" ON public.empreendimento_categorias FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar empreendimento_cidades" ON public.empreendimento_cidades FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar empreendimento_construtoras" ON public.empreendimento_construtoras FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar empreendimento_faixas_preco" ON public.empreendimento_faixas_preco FOR ALL USING (is_admin_or_colab(auth.uid()));
CREATE POLICY "Admins podem gerenciar empreendimento_segmentos" ON public.empreendimento_segmentos FOR ALL USING (is_admin_or_colab(auth.uid()));

-- Criar buckets de storage
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('empreendimentos-imagens', 'empreendimentos-imagens', true),
  ('empreendimentos-plantas', 'empreendimentos-plantas', true),
  ('empreendimentos-arquivos', 'empreendimentos-arquivos', false);

-- Políticas de storage
CREATE POLICY "Admins podem fazer upload de imagens" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'empreendimentos-imagens' AND is_admin_or_colab(auth.uid()));

CREATE POLICY "Todos podem ver imagens" ON storage.objects 
  FOR SELECT USING (bucket_id = 'empreendimentos-imagens');

CREATE POLICY "Admins podem fazer upload de plantas" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'empreendimentos-plantas' AND is_admin_or_colab(auth.uid()));

CREATE POLICY "Todos podem ver plantas" ON storage.objects 
  FOR SELECT USING (bucket_id = 'empreendimentos-plantas');

CREATE POLICY "Admins podem fazer upload de arquivos" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'empreendimentos-arquivos' AND is_admin_or_colab(auth.uid()));

CREATE POLICY "Admins podem ver arquivos" ON storage.objects 
  FOR SELECT USING (bucket_id = 'empreendimentos-arquivos' AND is_admin_or_colab(auth.uid()));

-- Triggers para updated_at
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cidades_updated_at BEFORE UPDATE ON public.cidades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_construtoras_updated_at BEFORE UPDATE ON public.construtoras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faixas_preco_updated_at BEFORE UPDATE ON public.faixas_preco FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_segmentos_updated_at BEFORE UPDATE ON public.segmentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_campos_personalizados_updated_at BEFORE UPDATE ON public.campos_personalizados FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categorias_arquivo_updated_at BEFORE UPDATE ON public.categorias_arquivo FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_arquivos_empreendimento_updated_at BEFORE UPDATE ON public.arquivos_empreendimento FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_valores_campos_personalizados_updated_at BEFORE UPDATE ON public.valores_campos_personalizados FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_empreendimentos_updated_at BEFORE UPDATE ON public.empreendimentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();