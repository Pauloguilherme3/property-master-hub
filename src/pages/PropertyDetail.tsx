import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { ReservationForm } from "@/components/ui/ReservationForm";
import { ArrowLeft, Bed, Bath, Square, MapPin, Calendar, Heart, Share2, Edit, Trash2, User, Phone, Mail, FileText, Clock } from "lucide-react";
import { Property, UserRole } from "@/types";
import { mockEmpreendimentos as mockProperties, mockReservas as mockReservations, formatCurrency } from "@/utils/animations";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const foundProperty = mockProperties.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
      }
      setLoading(false);
    }, 500);
    
    window.scrollTo(0, 0);
  }, [id]);

  if (!user || loading) {
    return (
      <div className="container px-4 mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-80 bg-muted rounded w-full"></div>
          <div className="h-6 bg-muted rounded w-2/3"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-40 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container px-4 mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/properties">View All Properties</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const propertyReservations = mockReservations.filter(r => r.empreendimentoId === property.id);
  
  const canEditProperty = hasPermission([
    UserRole.GERENTE, 
    UserRole.ADMINISTRADOR, 
    UserRole.GERENTE_PRODUTO
  ]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareProperty = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="container px-4 mx-auto py-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold sm:text-3xl truncate">
            {property.nome}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFavorite}
            className={isFavorite ? "text-red-500" : ""}
          >
            <Heart className="h-4 w-4 mr-2" fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Saved" : "Save"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareProperty}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          {canEditProperty && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to={`/properties/${property.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        {property.status === "disponivel" && (
          <Badge className="bg-green-100 text-green-800">Disponível</Badge>
        )}
        {property.status === "reservado" && (
          <Badge className="bg-yellow-100 text-yellow-800">Reservado</Badge>
        )}
        
        {property.destaque && (
          <Badge className="ml-2 bg-primary/90 text-white">
            Featured
          </Badge>
        )}
      </div>
      
      <div className="mb-8">
        {property.imagens.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {property.imagens.map((image, index) => (
                <CarouselItem key={index} className="pl-0">
                  <div className="aspect-video overflow-hidden rounded-xl">
                    <img
                      src={image}
                      alt={`${property.nome} - Image ${index + 1}`}
                      className="w-full h-full object-cover transition-all hover:scale-105 duration-500"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="aspect-video bg-muted flex items-center justify-center rounded-xl">
            <p className="text-muted-foreground">No images available</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-3xl font-bold text-primary mb-2 md:mb-0">
                  {formatCurrency(property.preco)}
                </h2>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    {property.endereco}, {property.cidade}, {property.estado} {property.cep}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <Bed className="h-5 w-5 text-primary mb-2" />
                  <span className="text-lg font-medium">{property.dormitorios}</span>
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <Bath className="h-5 w-5 text-primary mb-2" />
                  <span className="text-lg font-medium">{property.banheiros}</span>
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <Square className="h-5 w-5 text-primary mb-2" />
                  <span className="text-lg font-medium">{property.area}</span>
                  <span className="text-sm text-muted-foreground">m² Area</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {property.descricao}
                </p>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Property Information</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Property ID</dt>
                    <dd className="font-medium">{property.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Property Type</dt>
                    <dd className="font-medium">Residential</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Year Built</dt>
                    <dd className="font-medium">2018</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Parking</dt>
                    <dd className="font-medium">2 Spaces</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Heating</dt>
                    <dd className="font-medium">Central</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Cooling</dt>
                    <dd className="font-medium">Central A/C</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md bg-muted overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Map view would be displayed here in a complete implementation
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {property.endereco}, {property.cidade}, {property.estado} {property.cep}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Tabs defaultValue="schedule">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule a Viewing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReservationForm property={property} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contact" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="mr-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">John Doe</h4>
                        <p className="text-sm text-muted-foreground">Listing Agent</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>(555) 123-4567</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>agent@example.com</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Office Hours</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Monday - Friday</span>
                          <span>9:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday</span>
                          <span>10:00 AM - 3:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sunday</span>
                          <span>Closed</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Contact Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {propertyReservations.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Viewings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {propertyReservations.map(reservation => (
                    <div key={reservation.id} className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-muted flex-shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <p className="font-medium text-sm">{reservation.nomeCliente}</p>
                          <Badge 
                            variant="outline" 
                            className={
                              reservation.status === "confirmada"
                                ? "ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs"
                                : "ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs"
                            }
                          >
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(reservation.dataInicio).toLocaleString()}
                        </div>
                        {reservation.observacoes && (
                          <div className="flex items-start text-xs text-muted-foreground mt-1">
                            <FileText className="h-3 w-3 mr-1 mt-0.5" />
                            <span>{reservation.observacoes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
