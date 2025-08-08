import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Empreendimento } from "@/types";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface EmpreendimentosMapProps {
  empreendimentos: Empreendimento[];
}

const TOKEN_STORAGE_KEY = "MAPBOX_TOKEN";

const EmpreendimentosMap: React.FC<EmpreendimentosMapProps> = ({ empreendimentos }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");

  // Try to load token from DB then localStorage
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Try to fetch from configuracoes_sistema
        const { data } = await supabase
          .from("configuracoes_sistema")
          .select("valor")
          .eq("chave", "mapbox_token")
          .order("atualizado_em", { ascending: false })
          .limit(1)
          .maybeSingle();
        const dbToken = data?.valor || null;
        const stored = dbToken || localStorage.getItem(TOKEN_STORAGE_KEY);
        if (mounted) setToken(stored);
      } catch (_) {
        const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (mounted) setToken(stored);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !token || map.current) return;

    mapboxgl.accessToken = token;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-47.8825, -15.7942], // Brasil
      zoom: 3.2,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    map.current.on("load", () => {
      // Add markers for empreendimentos with coordinates
      empreendimentos.forEach((e) => {
        const coords = e.coordenadas;
        if (!coords) return;

        const el = document.createElement("div");
        el.className = "rounded-full bg-primary/80 border border-primary-foreground/20 shadow-md";
        el.style.width = "14px";
        el.style.height = "14px";

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([coords.lng, coords.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 12 }).setHTML(
              `<div style="min-width:200px">
                <strong>${e.nome}</strong><br/>
                ${e.cidade}, ${e.estado}<br/>
                <button id="goto-${e.id}" style="margin-top:6px;padding:6px 10px;border-radius:6px;border:1px solid #eee;background:#fff;cursor:pointer">Ver detalhes</button>
              </div>`
            )
          )
          .addTo(map.current!);

        marker.getElement().addEventListener("click", () => {
          // Defer binding until popup opens
          setTimeout(() => {
            const btn = document.getElementById(`goto-${e.id}`);
            if (btn) btn.onclick = () => navigate(`/empreendimentos/${e.id}`);
          }, 0);
        });
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [token, empreendimentos, navigate]);

  const handleSaveToken = async () => {
    if (!tokenInput) return;
    localStorage.setItem(TOKEN_STORAGE_KEY, tokenInput);
    setToken(tokenInput);
  };

  return (
    <div className="relative w-full h-[70vh] rounded-md overflow-hidden">
      {!token && (
        <Card className="absolute inset-4 z-10 p-4 max-w-md bg-background/95 backdrop-blur border">
          <h3 className="font-semibold mb-2">Configurar Mapbox</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Insira seu Mapbox Public Token temporariamente. Idealmente, configure-o nas Secrets do Supabase (Edge Functions).
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="pk.***"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <Button onClick={handleSaveToken}>Usar</Button>
          </div>
        </Card>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default EmpreendimentosMap;
