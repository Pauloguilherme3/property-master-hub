
import { useState } from "react";
import { Link } from "react-router-dom";
import { Property } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/animations";

interface PropertyCardProps {
  property: Property;
  variant?: "default" | "compact" | "featured";
}

export function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const propertyImage = property.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";

  const statusColors = {
    available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    reserved: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    sold: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  };

  const isFeatured = variant === "featured" || property.featured;
  const isCompact = variant === "compact";

  return (
    <Card 
      className={cn(
        "overflow-hidden hover-card transition-all duration-500",
        isFeatured && "border-primary/20"
      )}
    >
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <img
              src={propertyImage}
              alt={property.title}
              className={cn(
                "object-cover w-full h-full transition-all duration-500",
                !imageLoaded && "image-loading",
                imageLoaded && "image-loaded"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </AspectRatio>
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <Badge 
              className={cn(
                "px-2 py-1 text-xs font-semibold uppercase",
                statusColors[property.status]
              )}
            >
              {property.status}
            </Badge>
            {isFeatured && (
              <Badge 
                className="bg-primary/90 text-white"
                variant="default"
              >
                Featured
              </Badge>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
              isFavorite && "text-red-500"
            )}
            onClick={toggleFavorite}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
            <h3 className="text-lg font-bold line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-sm">
              <MapPin size={14} className="mr-1" />
              <span className="line-clamp-1">{property.city}, {property.state}</span>
            </div>
          </div>
        </div>
        <CardContent className={cn("p-4", isCompact && "py-2")}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-bold text-primary">
              {formatCurrency(property.price)}
            </p>
            {!isCompact && (
              <Badge variant="outline" className="font-normal">
                ID: {property.id.slice(0, 8)}
              </Badge>
            )}
          </div>
          {!isCompact && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {property.description}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Bed size={16} className="mr-1" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
            </div>
            <div className="flex items-center">
              <Bath size={16} className="mr-1" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</span>
            </div>
            <div className="flex items-center">
              <Square size={16} className="mr-1" />
              <span>{property.area} m²</span>
            </div>
          </div>
        </CardContent>
        {!isCompact && (
          <CardFooter className="px-4 py-2 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground w-full text-right">
              Added {new Date(property.createdAt).toLocaleDateString()}
            </p>
          </CardFooter>
        )}
      </Link>
    </Card>
  );
}
