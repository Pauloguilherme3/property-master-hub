import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface GoogleMapsTabProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

export function GoogleMapsTab({ formData, updateFormData }: GoogleMapsTabProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    // Try to get Mapbox token from localStorage or show input
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      initializeMap(savedToken);
    }
  }, []);

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-46.6333, -23.5505], // São Paulo
      zoom: 10
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      updateFormData('latitude', lat);
      updateFormData('longitude', lng);
      
      // Update marker
      if (marker.current) {
        marker.current.remove();
      }
      
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current!);
    });

    // If we have coordinates, add marker
    if (formData.latitude && formData.longitude) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([formData.longitude, formData.latitude])
        .addTo(map.current);
      
      map.current.setCenter([formData.longitude, formData.latitude]);
    }
  };

  const saveMapboxToken = () => {
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      initializeMap(mapboxToken);
    }
  };

  const searchLocation = async () => {
    if (!searchAddress || !mapboxToken) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchAddress)}.json?access_token=${mapboxToken}&country=BR&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const fullAddress = data.features[0].place_name;
        
        updateFormData('latitude', lat);
        updateFormData('longitude', lng);
        updateFormData('endereco_completo', fullAddress);
        
        if (map.current) {
          map.current.setCenter([lng, lat]);
          map.current.setZoom(15);
          
          if (marker.current) {
            marker.current.remove();
          }
          
          marker.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  };

  if (!mapboxToken) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 border border-dashed rounded-lg">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Configurar Mapbox</h3>
          <p className="text-muted-foreground mb-4">
            Para usar o mapa, você precisa inserir um token do Mapbox
          </p>
          <div className="max-w-md mx-auto space-y-2">
            <Input
              placeholder="Cole seu token do Mapbox aqui"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={saveMapboxToken} disabled={!mapboxToken}>
              Configurar Mapa
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Obtenha seu token em{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Busca de Endereço */}
      <div>
        <Label htmlFor="search-address">Buscar Endereço</Label>
        <div className="flex gap-2">
          <Input
            id="search-address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Digite o endereço para buscar"
            onKeyDown={(e) => e.key === 'Enter' && searchLocation()}
          />
          <Button onClick={searchLocation} disabled={!searchAddress}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Endereço Completo */}
      <div>
        <Label htmlFor="endereco-completo">Endereço Completo</Label>
        <Input
          id="endereco-completo"
          value={formData.endereco_completo}
          onChange={(e) => updateFormData('endereco_completo', e.target.value)}
          placeholder="Endereço completo do empreendimento"
        />
      </div>

      {/* Coordenadas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude || ''}
            onChange={(e) => updateFormData('latitude', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Ex: -23.5505"
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude || ''}
            onChange={(e) => updateFormData('longitude', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Ex: -46.6333"
          />
        </div>
      </div>

      {/* Mapa */}
      <div>
        <Label>Localização no Mapa</Label>
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Clique no mapa para marcar a localização exata do empreendimento
        </p>
      </div>
    </div>
  );
}