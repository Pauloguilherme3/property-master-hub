
import { useState, useEffect } from "react";
import { Empreendimento, Unidade } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/utils/animations";
import { supabase } from "@/integrations/supabase/client";

interface ReservaFormularioProps {
  empreendimento: Empreendimento;
  unidade: Unidade;
}

export function ReservaFormulario({ empreendimento, unidade }: ReservaFormularioProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [data, setData] = useState<Date | undefined>(undefined);
  const [horario, setHorario] = useState("");
  const [tipoVisita, setTipoVisita] = useState<"presencial" | "virtual">("presencial");
  const [observacoes, setObservacoes] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>(["09:00","10:00","11:00","14:00","15:00","16:00","17:00"]);

  useEffect(() => {
    // Carregar horários do Supabase (configuracoes_sistema)
    (async () => {
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
        if (arr.length) setHorariosDisponiveis(arr);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data || !horario || !nome || !telefone || !cpf) {
      toast({
        title: "Erro",
        description: "Preencha nome, telefone, CPF, data e horário.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      empreendimento_id: empreendimento.id,
      unidade_id: unidade.id,
      nome_cliente: nome,
      telefone_cliente: telefone,
      cpf_cliente: cpf,
      data_visita: format(data, "yyyy-MM-dd"),
      horario,
      tipo_visita: tipoVisita,
      observacoes,
      status: "pendente",
    };

    const { error } = await supabase.from("reservas").insert(payload);

    if (error) {
      toast({ title: "Erro ao reservar", description: error.message, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Reserva enviada",
      description: `Sua reserva para ${unidade.numero} em ${format(data, "PPP", { locale: ptBR })} às ${horario} foi registrada.`,
    });

    // Resetar formulário
    setNome("");
    setEmail("");
    setTelefone("");
    setCpf("");
    setData(undefined);
    setHorario("");
    setTipoVisita("presencial");
    setObservacoes("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo</Label>
          <Input
            id="nome"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email (opcional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu endereço de email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            placeholder="Digite seu telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            placeholder="Digite seu CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="data">Data da Visita</Label>
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
                  // Desabilitar datas no passado e mais de 30 dias no futuro
                  const maxDate = new Date();
                  maxDate.setDate(maxDate.getDate() + 30);
                  return date < today || date > maxDate;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="horario">Horário</Label>
          <Select 
            value={horario} 
            onValueChange={setHorario}
          >
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
          placeholder="Alguma observação ou pergunta específica?"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="rounded-lg bg-muted p-4">
        <h3 className="text-lg font-semibold mb-2">Detalhes da Unidade</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Empreendimento:</span>
            <span className="font-medium">{empreendimento.nome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unidade:</span>
            <span className="font-medium">{unidade.numero}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Área:</span>
            <span className="font-medium">{unidade.area} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor:</span>
            <span className="font-medium">{formatCurrency(unidade.preco)}</span>
          </div>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full transition-all transform hover:translate-y-[-2px]"
        disabled={isSubmitting || !data || !horario}
      >
        {isSubmitting ? "Enviando..." : "Solicitar Reserva"}
      </Button>
      
      <p className="text-sm text-muted-foreground text-center">
        Ao solicitar a reserva, você será contatado por um de nossos corretores para confirmar os detalhes.
      </p>
    </form>
  );
}
