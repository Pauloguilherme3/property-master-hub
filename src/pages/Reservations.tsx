
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Search, Filter, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { mockProperties, mockReservations } from "@/utils/animations";
import { Reservation } from "@/types";

const ReservationsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Initialize reservations with property data
    const enhancedReservations = mockReservations.map(reservation => ({
      ...reservation,
      property: mockProperties.find(p => p.id === reservation.propertyId)
    }));
    
    setReservations(enhancedReservations);
    setFilteredReservations(enhancedReservations);
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, selectedDate, reservations]);

  const filterReservations = () => {
    let filtered = [...reservations];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(reservation => 
        reservation.clientName.toLowerCase().includes(term) ||
        reservation.clientEmail.toLowerCase().includes(term) ||
        reservation.property?.title.toLowerCase().includes(term) ||
        reservation.property?.address.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }
    
    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter(reservation => {
        const reservationDate = new Date(reservation.startDate);
        return (
          reservationDate.getDate() === selectedDate.getDate() &&
          reservationDate.getMonth() === selectedDate.getMonth() &&
          reservationDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }
    
    setFilteredReservations(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Reservations
        </h1>
        <p className="text-muted-foreground">
          Manage and view all property reservations.
        </p>
      </div>
      
      <Tabs
        defaultValue="list"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-[200px]"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reservation.clientName}</p>
                            <p className="text-sm text-muted-foreground">{reservation.clientEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reservation.property?.title || "Unknown Property"}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {reservation.property?.address || ""}, {reservation.property?.city || ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {new Date(reservation.startDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(reservation.startDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                              {" - "}
                              {new Date(reservation.endDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(reservation.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <Link to={`/properties/${reservation.propertyId}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View property</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <CalendarIcon className="h-10 w-10 mb-2" />
                          <p className="text-lg font-medium">No reservations found</p>
                          <p className="text-sm">
                            {searchTerm || statusFilter !== "all" || selectedDate
                              ? "Try adjusting your filters"
                              : "No reservations have been scheduled yet"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Reservation Calendar</CardTitle>
              <CardDescription>
                View and manage reservations by date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border rounded-md"
                    initialFocus
                  />
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">
                    {selectedDate ? (
                      `Reservations for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                    ) : (
                      "Select a date to view reservations"
                    )}
                  </h3>
                  
                  {filteredReservations.length > 0 ? (
                    <div className="space-y-3">
                      {filteredReservations.map(reservation => (
                        <Card key={reservation.id} className="hover-card">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">
                                {new Date(reservation.startDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                                {" - "}
                                {new Date(reservation.endDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </div>
                              {getStatusBadge(reservation.status)}
                            </div>
                            
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={reservation.property?.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                                  alt={reservation.property?.title || "Property"}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{reservation.property?.title || "Unknown Property"}</p>
                                <p className="text-sm text-muted-foreground">
                                  {reservation.property?.address || ""}, {reservation.property?.city || ""}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div>
                                <p><span className="font-medium">Client:</span> {reservation.clientName}</p>
                                <p>{reservation.clientEmail}</p>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <Link to={`/properties/${reservation.propertyId}`}>
                                  View Property
                                </Link>
                              </Button>
                            </div>
                            
                            {reservation.notes && (
                              <div className="mt-3 pt-3 border-t text-sm">
                                <p className="font-medium mb-1">Notes:</p>
                                <p className="text-muted-foreground">{reservation.notes}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-lg font-medium">No reservations found</p>
                        <p className="text-sm text-muted-foreground">
                          There are no reservations scheduled for this date
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsPage;
