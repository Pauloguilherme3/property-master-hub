
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { Empreendimento } from "@/types";

interface PropertyCardProps {
  property: Empreendimento;
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Get status in Portuguese
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "reservado":
        return "Reservado";
      case "vendido":
        return "Vendido";
      default:
        return status;
    }
  };

  return (
    <div className="group overflow-hidden border rounded-lg transition-all hover:shadow-md">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {property.imagens && property.imagens.length > 0 ? (
          <img 
            src={property.imagens[0]} 
            alt={property.nome} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Building className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
          {getStatusLabel(property.status)}
        </div>
        {property.destaque && (
          <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-amber-500 text-white rounded-full">
            Destaque
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold truncate">{property.nome}</h3>
        <p className="text-sm text-muted-foreground truncate">{property.cidade}, {property.estado}</p>
        
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {property.dormitorios > 0 && (
            <span>{property.dormitorios} {property.dormitorios === 1 ? 'Dormitório' : 'Dormitórios'}</span>
          )}
          {property.banheiros > 0 && (
            <span>• {property.banheiros} {property.banheiros === 1 ? 'Banheiro' : 'Banheiros'}</span>
          )}
          {property.area > 0 && (
            <span>• {property.area}m²</span>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL',
              maximumFractionDigits: 0 
            }).format(property.preco)}
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/empreendimentos/${property.id}`}>Detalhes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
