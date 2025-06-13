import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { ChevronRight } from "lucide-react";
import type { Category, Product } from "@shared/schema";

export default function ProductsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFilter = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    categoryFilter ? [parseInt(categoryFilter)] : []
  );
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState("featured");

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || 
                           (product.categoryId && selectedCategories.includes(product.categoryId));
    const matchesPrice = parseFloat(product.price) >= priceRange[0] && 
                        parseFloat(product.price) <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      default:
        return 0;
    }
  });

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="text-slate-500 hover:text-slate-700">
              Home
            </a>
          </li>
          <li>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </li>
          <li>
            <span className="text-slate-800 font-medium">Products</span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            {/* Search */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Search Products</h4>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Category</h4>
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {categories?.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category.id, !!checked)
                        }
                      />
                      <label 
                        htmlFor={`category-${category.id}`} 
                        className="text-sm cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000}
                  step={10}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Sort and Results */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-slate-600">
              Showing {sortedProducts.length} products
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Customer Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategories([]);
                  setPriceRange([0, 2000]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
