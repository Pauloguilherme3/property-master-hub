
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Building, Users, PieChart, List, ArrowRight } from "lucide-react";
import { mockProperties, mockReservations } from "@/utils/animations";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  // Get most recent properties
  const recentProperties = [...mockProperties].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 3);

  // Get upcoming reservations
  const upcomingReservations = [...mockReservations]
    .filter(res => res.status !== "cancelled")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Properties",
            value: "24",
            description: "7% increase from last month",
            icon: Building,
            color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30"
          },
          {
            title: "Active Reservations",
            value: "18",
            description: "5 new since last week",
            icon: CalendarIcon,
            color: "text-green-500 bg-green-100 dark:bg-green-900/30"
          },
          {
            title: "Total Clients",
            value: "137",
            description: "12 new clients this month",
            icon: Users,
            color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30"
          },
          {
            title: "Conversion Rate",
            value: "24%",
            description: "3% increase from last month",
            icon: PieChart,
            color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30"
          }
        ].map((stat, index) => (
          <Card key={index} className="hover-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Properties</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/properties" className="flex items-center">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Reservations</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/reservations" className="flex items-center">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Reservation Schedule</CardTitle>
            <CardDescription>
              You have {upcomingReservations.length} upcoming reservations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReservations.map((reservation) => {
                const property = mockProperties.find(p => p.id === reservation.propertyId);
                return (
                  <div key={reservation.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={property?.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                        alt={property?.title || "Property"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {property?.title || "Unknown Property"}
                      </p>
                      <div className="flex text-xs text-muted-foreground">
                        <span className="truncate">
                          Client: {reservation.clientName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(reservation.startDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(reservation.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      reservation.status === "confirmed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {reservation.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm">
            <span className="flex items-center">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                {
                  icon: Building,
                  title: "New property added",
                  description: "Modern Downtown Apartment was added to the listings",
                  time: "2 hours ago",
                  user: "Jane Cooper"
                },
                {
                  icon: Users,
                  title: "New client registered",
                  description: "Michael Johnson signed up through the website",
                  time: "5 hours ago",
                  user: "System"
                },
                {
                  icon: List,
                  title: "Property update",
                  description: "Price for Luxury Waterfront Villa was updated",
                  time: "Yesterday",
                  user: "John Doe"
                },
                {
                  icon: CalendarIcon,
                  title: "Reservation confirmed",
                  description: "Viewing for Suburban Family Home confirmed",
                  time: "Yesterday",
                  user: "System"
                }
              ].map((activity, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="p-2 rounded-full bg-muted flex-shrink-0">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">By: {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
