import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Building2, 
  Ruler, 
  Eye, 
  Edit, 
  MoreVertical,
  ImageIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PropertyCardProps {
  empreendimento: any; // Use any for now since we have the complete Supabase schema
  onView: () => void;
  onEdit?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo':
      return 'bg-green-500/10 text-green-700 border-green-200 dark:text-green-400';
    case 'inativo':
      return 'bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400';
    case 'vendido':
      return 'bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400';
    default:
      return 'bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ativo':
      return 'Ativo';
    case 'inativo':
      return 'Inativo';
    case 'vendido':
      return 'Vendido';
    default:
      return status;
  }
};

export function PropertyCard({ empreendimento, onView, onEdit }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg border-muted">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {empreendimento.foto_capa_url && !imageError ? (
          <img
            src={empreendimento.foto_capa_url}
            alt={empreendimento.nome}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Sem imagem</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(empreendimento.status_empreendimento)} backdrop-blur-sm`}
          >
            {getStatusLabel(empreendimento.status_empreendimento)}
          </Badge>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 w-8 p-0 backdrop-blur-sm bg-background/80 hover:bg-background/90"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                Ver detalhes
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-lg leading-tight line-clamp-1">
            {empreendimento.nome}
          </CardTitle>
          {empreendimento.titulo && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {empreendimento.titulo}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Location */}
        {empreendimento.endereco_completo && (
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {empreendimento.endereco_completo}
            </p>
          </div>
        )}

        {/* Description */}
        {empreendimento.descricao && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {empreendimento.descricao}
          </p>
        )}

        {/* Metrics */}
        <div className="flex items-center gap-4 mb-4">
          {empreendimento.metragem_min && empreendimento.metragem_max && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Ruler className="h-4 w-4" />
              <span>
                {empreendimento.metragem_min === empreendimento.metragem_max 
                  ? `${empreendimento.metragem_min}m²`
                  : `${empreendimento.metragem_min}-${empreendimento.metragem_max}m²`
                }
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button 
          onClick={onView} 
          className="w-full"
          variant="outline"
        >
          <Building2 className="h-4 w-4 mr-2" />
          Ver Empreendimento
        </Button>
      </CardContent>
    </Card>
  );
}