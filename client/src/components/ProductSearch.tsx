import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import type { Product, Category } from "@shared/schema";

interface ProductSearchProps {
  onFiltersChange: (filteredProducts: Product[]) => void;
}

interface SearchFilters {
  searchTerm: string;
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  minRating: number;
  sortBy: string;
}

export default function ProductSearch({ onFiltersChange }: ProductSearchProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    category: "",
    priceRange: [0, 1000],
    inStock: false,
    minRating: 0,
    sortBy: "name",
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return [0, 1000];
    const prices = products.map(p => parseFloat(p.price));
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  // Update price range when products load
  useEffect(() => {
    if (priceRange[1] > 0 && filters.priceRange[1] === 1000) {
      setFilters(prev => ({ ...prev, priceRange }));
    }
  }, [priceRange]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.categoryId === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Rating filter (mock ratings for demo)
    if (filters.minRating > 0) {
      filtered = filtered.filter(() => {
        // Mock rating between 3-5 for demo purposes
        const mockRating = 3 + Math.random() * 2;
        return mockRating >= filters.minRating;
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  // Notify parent component of filtered products
  useEffect(() => {
    onFiltersChange(filteredProducts);
  }, [filteredProducts, onFiltersChange]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      category: "",
      priceRange,
      inStock: false,
      minRating: 0,
      sortBy: "name",
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.category) count++;
    if (filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1]) count++;
    if (filters.inStock) count++;
    if (filters.minRating > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 px-2 py-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      {isFiltersOpen && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFiltersOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id!}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter("priceRange", value)}
                  max={priceRange[1]}
                  min={priceRange[0]}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Minimum Rating: {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
                </Label>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={(value) => updateFilter("minRating", value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Stock Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Availability</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={filters.inStock}
                    onCheckedChange={(checked) => updateFilter("inStock", checked)}
                  />
                  <Label htmlFor="inStock" className="text-sm">
                    In Stock Only
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Active Filters:</Label>
                <div className="flex flex-wrap gap-2">
                  {filters.searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Search: "{filters.searchTerm}"
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter("searchTerm", "")}
                      />
                    </Badge>
                  )}
                  {filters.category && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Category: {categories.find(c => c._id === filters.category)?.name}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter("category", "")}
                      />
                    </Badge>
                  )}
                  {(filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1]) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter("priceRange", priceRange)}
                      />
                    </Badge>
                  )}
                  {filters.inStock && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      In Stock Only
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter("inStock", false)}
                      />
                    </Badge>
                  )}
                  {filters.minRating > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Rating: {filters.minRating}+ stars
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilter("minRating", 0)}
                      />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}