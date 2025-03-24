
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProperties } from "@/utils/animations";
import { Building, Search, Plus, SlidersHorizontal, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";

const Properties = () => {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [bedroomsFilter, setBedroomsFilter] = useState<number[]>([]);
  const [bathroomsFilter, setBathroomsFilter] = useState<number[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  
  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3, 4, 5];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const toggleBedroomFilter = (value: number) => {
    setBedroomsFilter(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  const toggleBathroomFilter = (value: number) => {
    setBathroomsFilter(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortOption("newest");
    setPriceRange([0, 2000000]);
    setBedroomsFilter([]);
    setBathroomsFilter([]);
    setFeaturedOnly(false);
  };

  // Apply filters and sorting
  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.state.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || property.status === statusFilter;
      
      const matchesPrice = 
        property.price >= priceRange[0] && 
        property.price <= priceRange[1];
      
      const matchesBedrooms = 
        bedroomsFilter.length === 0 || 
        bedroomsFilter.includes(property.bedrooms);
      
      const matchesBathrooms = 
        bathroomsFilter.length === 0 || 
        bathroomsFilter.includes(property.bathrooms);
      
      const matchesFeatured = !featuredOnly || property.featured;
      
      return matchesSearch && matchesStatus && matchesPrice && matchesBedrooms && matchesBathrooms && matchesFeatured;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        default:
          return 0;
      }
    });

  if (!user) return null;

  const canAddProperty = hasPermission([
    UserRole.MANAGER, 
    UserRole.ADMINISTRATOR, 
    UserRole.PRODUCT_MANAGER
  ]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const activeFilterCount = 
    (statusFilter !== "all" ? 1 : 0) + 
    bedroomsFilter.length + 
    bathroomsFilter.length + 
    (featuredOnly ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 2000000 ? 1 : 0);

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Properties
          </h1>
          <p className="text-muted-foreground">
            Manage and browse all available properties.
          </p>
        </div>
        
        {canAddProperty && (
          <Button asChild>
            <Link to="/properties/add" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters - Desktop */}
        <Card className="lg:block hidden">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Refine your property search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Properties</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={2000000}
                    step={10000}
                    onValueChange={setPriceRange}
                    className="my-5"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>{formatPrice(priceRange[0])}</div>
                  <div>{formatPrice(priceRange[1])}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {bedroomOptions.map(num => (
                    <div key={`bed-${num}`} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`bed-${num}`} 
                        checked={bedroomsFilter.includes(num)}
                        onCheckedChange={() => toggleBedroomFilter(num)}
                      />
                      <Label htmlFor={`bed-${num}`}>{num}+</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Bathrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {bathroomOptions.map(num => (
                    <div key={`bath-${num}`} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`bath-${num}`} 
                        checked={bathroomsFilter.includes(num)}
                        onCheckedChange={() => toggleBathroomFilter(num)}
                      />
                      <Label htmlFor={`bath-${num}`}>{num}+</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={featuredOnly}
                    onCheckedChange={(checked) => setFeaturedOnly(!!checked)}
                  />
                  <Label htmlFor="featured">Featured properties only</Label>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3 space-y-6">
          {/* Search and filters - Mobile & Desktop */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={18} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          {/* Mobile Filters Dialog */}
          {showFilters && (
            <Card className="lg:hidden">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle>Filters</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                >
                  <X size={18} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All Properties</SelectItem>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={2000000}
                        step={10000}
                        onValueChange={setPriceRange}
                        className="my-5"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>{formatPrice(priceRange[0])}</div>
                      <div>{formatPrice(priceRange[1])}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Bedrooms</h3>
                      <div className="flex flex-wrap gap-2">
                        {bedroomOptions.map(num => (
                          <div key={`mob-bed-${num}`} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mob-bed-${num}`} 
                              checked={bedroomsFilter.includes(num)}
                              onCheckedChange={() => toggleBedroomFilter(num)}
                            />
                            <Label htmlFor={`mob-bed-${num}`}>{num}+</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Bathrooms</h3>
                      <div className="flex flex-wrap gap-2">
                        {bathroomOptions.map(num => (
                          <div key={`mob-bath-${num}`} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mob-bath-${num}`} 
                              checked={bathroomsFilter.includes(num)}
                              onCheckedChange={() => toggleBathroomFilter(num)}
                            />
                            <Label htmlFor={`mob-bath-${num}`}>{num}+</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mob-featured" 
                        checked={featuredOnly}
                        onCheckedChange={(checked) => setFeaturedOnly(!!checked)}
                      />
                      <Label htmlFor="mob-featured">Featured properties only</Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                    <Button 
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active filters:</span>
              
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {statusFilter}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => setStatusFilter("all")}
                  />
                </Badge>
              )}
              
              {bedroomsFilter.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Bedrooms: {bedroomsFilter.sort().join(", ")}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => setBedroomsFilter([])}
                  />
                </Badge>
              )}
              
              {bathroomsFilter.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Bathrooms: {bathroomsFilter.sort().join(", ")}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => setBathroomsFilter([])}
                  />
                </Badge>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 2000000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => setPriceRange([0, 2000000])}
                  />
                </Badge>
              )}
              
              {featuredOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Featured only
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => setFeaturedOnly(false)}
                  />
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs h-8 px-2"
              >
                Clear all
              </Button>
            </div>
          )}
          
          {/* Properties grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No properties found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  We couldn't find any properties that match your search criteria. Try adjusting your filters or search for something else.
                </p>
                <Button onClick={resetFilters}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
