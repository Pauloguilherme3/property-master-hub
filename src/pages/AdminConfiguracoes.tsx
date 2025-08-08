import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminConfiguracoes = () => {
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [horarios, setHorarios] = useState("09:00,10:00,11:00,14:00,15:00,16:00,17:00");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: tokenRow } = await supabase
          .from("configuracoes_sistema")
          .select("id, valor")
          .eq("chave", "mapbox_token")
          .order("atualizado_em", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (tokenRow?.valor) setToken(tokenRow.valor);

        const { data: horariosRow } = await supabase
          .from("configuracoes_sistema")
          .select("id, valor")
          .eq("chave", "reserva_horarios")
          .order("atualizado_em", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (horariosRow?.valor) setHorarios(horariosRow.valor);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveSetting = async (chave: string, valor: string) => {
    const { data: existing } = await supabase
      .from("configuracoes_sistema")
      .select("id")
      .eq("chave", chave)
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      await supabase.from("configuracoes_sistema").update({ valor }).eq("id", existing.id);
    } else {
      await supabase.from("configuracoes_sistema").insert({ chave, valor });
    }
  };

  const handleSave = async () => {
    await Promise.all([
      saveSetting("mapbox_token", token.trim()),
      saveSetting("reserva_horarios", horarios.trim()),
    ]);
    toast({ title: "Configurações salvas" });
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Painel de Configuração</CardTitle>
            <CardDescription>Gerencie o token do mapa e horários de visita</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Mapbox Public Token</Label>
              <Input placeholder="pk.***" value={token} onChange={(e) => setToken(e.target.value)} />
              <p className="text-xs text-muted-foreground">Dica: Configure também nas Secrets do Supabase para produção.</p>
            </div>
            <div className="space-y-2">
              <Label>Horários de Visita (separados por vírgula)</Label>
              <Textarea rows={3} value={horarios} onChange={(e) => setHorarios(e.target.value)} />
            </div>
            <Button onClick={handleSave} disabled={loading}>Salvar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
