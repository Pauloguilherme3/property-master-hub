import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedEmpreendimento?: string;
  preSelectedUnidade?: string;
}

type Empreendimento = Database['public']['Tables']['empreendimentos']['Row'];
type Unidade = Database['public']['Tables']['unidades']['Row'];

export function ReservaModal({ 
  isOpen, 
  onClose, 
  preSelectedEmpreendimento,
  preSelectedUnidade 
}: ReservaModalProps) {
  const { toast } = useToast();
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [data, setData] = useState<Date | undefined>(undefined);
  const [horario, setHorario] = useState("");
  const [observacoes, setObservacoes] = useState("");
  
  // Selection states
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState(preSelectedEmpreendimento || "");
  const [selectedUnidade, setSelectedUnidade] = useState(preSelectedUnidade || "");
  const [searchEmpreendimento, setSearchEmpreendimento] = useState("");
  
  // Data fetching
  const { data: empreendimentos = [], isLoading: loadingEmpreendimentos } = useQuery({
    queryKey: ["empreendimentos-modal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("empreendimentos")
        .select("*")
        .eq("status_empreendimento", "ativo")
        .order("nome");
      
      if (error) throw error;
      return data as Empreendimento[];
    }
  });

  const { data: unidades = [], isLoading: loadingUnidades } = useQuery({
    queryKey: ["unidades-modal", selectedEmpreendimento],
    enabled: !!selectedEmpreendimento,
    queryFn: async () => {
      if (!selectedEmpreendimento) return [];
      
      const { data, error } = await supabase
        .from("unidades")
        .select("*")
        .eq("empreendimento_id", selectedEmpreendimento)
        .eq("disponibilidade", "disponivel")
        .order("quadra", { ascending: true })
        .order("lote", { ascending: true });
      
      if (error) throw error;
      return data as Unidade[];
    }
  });

  const { data: horariosDisponiveis = ["09:00","10:00","11:00","14:00","15:00","16:00","17:00"] } = useQuery({
    queryKey: ["horarios-reserva"],
    queryFn: async () => {
      const { data } = await supabase
        .from("configuracoes_sistema")
        .select("valor")
        .eq("chave", "reserva_horarios")
        .order("atualizado_em", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      const valor = data?.valor as string | null;
      if (valor) {
        const arr = valor.split(",").map((s) => s.trim()).filter(Boolean);
        if (arr.length) return arr;
      }
      return ["09:00","10:00","11:00","14:00","15:00","16:00","17:00"];
    }
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNome("");
      setTelefone("");
      setCpf("");
      setData(undefined);
      setHorario("");
      setObservacoes("");
      if (!preSelectedEmpreendimento) setSelectedEmpreendimento("");
      if (!preSelectedUnidade) setSelectedUnidade("");
      setSearchEmpreendimento("");
    }
  }, [isOpen, preSelectedEmpreendimento, preSelectedUnidade]);

  // Set pre-selected values
  useEffect(() => {
    if (preSelectedEmpreendimento) {
      setSelectedEmpreendimento(preSelectedEmpreendimento);
    }
    if (preSelectedUnidade) {
      setSelectedUnidade(preSelectedUnidade);
    }
  }, [preSelectedEmpreendimento, preSelectedUnidade]);

  const filteredEmpreendimentos = empreendimentos.filter(emp =>
    emp.nome.toLowerCase().includes(searchEmpreendimento.toLowerCase())
  );

  const selectedEmpreendimentoData = empreendimentos.find(e => e.id === selectedEmpreendimento);
  const selectedUnidadeData = unidades.find(u => u.id === selectedUnidade);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmpreendimento || !selectedUnidade || !data || !horario || !nome || !telefone || !cpf) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      empreendimento_id: selectedEmpreendimento,
      unidade_id: selectedUnidade,
      nome_cliente: nome,
      telefone_cliente: telefone,
      cpf_cliente: cpf,
      data_visita: format(data, "yyyy-MM-dd"),
      horario,
      observacoes,
      status: "pendente",
    };

    const { error } = await supabase.from("reservas").insert(payload);

    if (error) {
      toast({ 
        title: "Erro ao criar reserva", 
        description: error.message, 
        variant: "destructive" 
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Reserva criada com sucesso!",
      description: `Reserva para ${selectedUnidadeData?.quadra}/${selectedUnidadeData?.lote} em ${format(data, "PPP", { locale: ptBR })} às ${horario}.`,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Reserva</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova reserva
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seleção de Empreendimento */}
          <div className="space-y-2">
            <Label htmlFor="empreendimento">Empreendimento</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Buscar empreendimento..."
                  value={searchEmpreendimento}
                  onChange={(e) => setSearchEmpreendimento(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select 
                value={selectedEmpreendimento} 
                onValueChange={(value) => {
                  setSelectedEmpreendimento(value);
                  setSelectedUnidade(""); // Reset unidade when empreendimento changes
                }}
              >
                <SelectTrigger id="empreendimento">
                  <SelectValue placeholder="Selecione um empreendimento" />
                </SelectTrigger>
                <SelectContent>
                  {loadingEmpreendimentos ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : filteredEmpreendimentos.length > 0 ? (
                    filteredEmpreendimentos.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-results" disabled>
                      {searchEmpreendimento ? "Nenhum resultado encontrado" : "Nenhum empreendimento disponível"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seleção de Unidade */}
          <div className="space-y-2">
            <Label htmlFor="unidade">Quadra/Lote</Label>
            <Select 
              value={selectedUnidade} 
              onValueChange={setSelectedUnidade}
              disabled={!selectedEmpreendimento}
            >
              <SelectTrigger id="unidade">
                <SelectValue placeholder={!selectedEmpreendimento ? "Selecione um empreendimento primeiro" : "Selecione quadra/lote"} />
              </SelectTrigger>
              <SelectContent>
                {loadingUnidades ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : unidades.length > 0 ? (
                  unidades.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id}>
                      Quadra {unidade.quadra} - Lote {unidade.lote} 
                      {unidade.area && ` (${unidade.area}m²)`}
                      {unidade.preco && ` - R$ ${unidade.preco.toLocaleString()}`}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-units" disabled>
                    Nenhuma unidade disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Dados do Cliente */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                placeholder="Digite o nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                placeholder="Digite o telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="Digite o CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          
          {/* Data e Horário */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="data">Data da Visita *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id="data"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data ? format(data, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data}
                    onSelect={setData}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const maxDate = new Date();
                      maxDate.setDate(maxDate.getDate() + 30);
                      return date < today || date > maxDate;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="horario">Horário *</Label>
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger id="horario">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {horariosDisponiveis.map((h) => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Resumo da Seleção */}
          {selectedEmpreendimentoData && selectedUnidadeData && (
            <div className="rounded-lg bg-muted p-4">
              <h3 className="text-sm font-semibold mb-2">Resumo da Reserva</h3>
              <div className="grid gap-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Empreendimento:</span>
                  <span className="font-medium">{selectedEmpreendimentoData.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quadra/Lote:</span>
                  <span className="font-medium">{selectedUnidadeData.quadra}/{selectedUnidadeData.lote}</span>
                </div>
                {selectedUnidadeData.area && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Área:</span>
                    <span className="font-medium">{selectedUnidadeData.area}m²</span>
                  </div>
                )}
                {selectedUnidadeData.preco && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-medium">R$ {selectedUnidadeData.preco.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !selectedEmpreendimento || !selectedUnidade || !data || !horario || !nome || !telefone || !cpf}
            >
              {isSubmitting ? "Criando..." : "Criar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}