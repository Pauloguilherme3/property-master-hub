
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const propertyFormSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  titulo: z.string().optional(),
  subtitulo: z.string().optional(),
  codigo: z.string().optional(),
  endereco_completo: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  metragem_min: z.coerce.number().min(1, "Metragem mínima deve ser maior que zero"),
  metragem_max: z.coerce.number().optional(),
  status_empreendimento: z.enum(["ativo", "inativo", "vendido"]).default("ativo"),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  onCancel: () => void;
}

export function PropertyForm({ onCancel }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      titulo: "",
      subtitulo: "",
      codigo: "",
      endereco_completo: "",
      latitude: 0,
      longitude: 0,
      metragem_min: 0,
      metragem_max: 0,
      status_empreendimento: "ativo",
    },
  });

  async function onSubmit(data: PropertyFormValues) {
    setIsSubmitting(true);
    try {
      // Save to Supabase
      const { error } = await supabase
        .from("empreendimentos")
        .insert({
          nome: data.nome,
          descricao: data.descricao,
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          codigo: data.codigo,
          endereco_completo: data.endereco_completo,
          latitude: data.latitude,
          longitude: data.longitude,
          metragem_min: data.metragem_min,
          metragem_max: data.metragem_max,
          status_empreendimento: data.status_empreendimento,
        });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Empreendimento criado",
        description: `O empreendimento ${data.nome} foi criado com sucesso.`,
      });
      
      // Navigate to the properties page
      navigate("/empreendimentos");
      onCancel();
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Erro ao criar empreendimento",
        description: "Ocorreu um erro ao criar o empreendimento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Adicionar Empreendimento</CardTitle>
          <CardDescription>Preencha os dados do novo empreendimento</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Empreendimento</FormLabel>
                    <FormControl>
                      <Input placeholder="Residencial Primavera" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do empreendimento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subtitulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Subtítulo do empreendimento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Código interno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="metragem_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metragem Mínima (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="metragem_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metragem Máxima (m²) - opcional</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endereco_completo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, Número, Bairro, Cidade, Estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status_empreendimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="vendido">Vendido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude (opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="-23.5505" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude (opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="-46.6333" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o empreendimento em detalhes..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Empreendimento"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
