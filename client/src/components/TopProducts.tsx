import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { TopProduct } from "@shared/schema";
import { Package, TrendingUp } from "lucide-react";

export default function TopProducts() {
  const { data: topProducts, isLoading } = useQuery<TopProduct[]>({
    queryKey: ["/api/analytics/top-products"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/top-products?limit=5");
      if (!response.ok) throw new Error("Failed to fetch top products");
      return response.json();
    },
  });

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Products
          </CardTitle>
          <CardDescription>Loading product performance...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topProducts || topProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Products
          </CardTitle>
          <CardDescription>No sales data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No product sales to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxRevenue = Math.max(...topProducts.map(p => p.revenue));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Products
        </CardTitle>
        <CardDescription>Best performing products by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topProducts.map((product, index) => (
            <div key={product.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm leading-tight">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {product.sales} sold
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(product.revenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Progress 
                value={(product.revenue / maxRevenue) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}