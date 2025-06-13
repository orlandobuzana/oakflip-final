import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { Star, Heart } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { openProductModal } = useProduct();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleCardClick = () => {
    openProductModal(product);
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating || "0");
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= numRating ? "text-yellow-400 fill-current" : "text-slate-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <Card className="product-card group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="product-image-container aspect-square overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          onClick={handleCardClick}
        />
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/100 opacity-0 group-hover:opacity-100 transition-opacity p-2"
          onClick={(e) => {
            e.stopPropagation();
            toast({
              title: "Added to wishlist",
              description: `${product.name} has been added to your wishlist.`,
            });
          }}
        >
          <Heart className="w-4 h-4" />
        </Button>
        
        {product.originalPrice && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            Sale
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4" onClick={handleCardClick}>
        <div className="flex items-center mb-2">
          <div className="flex">
            {renderStars(product.rating || "0")}
          </div>
          <span className="text-slate-500 text-sm ml-2">
            ({product.reviewCount || 0} reviews)
          </span>
        </div>
        
        <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-slate-800">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="transition-colors"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
        
        {product.stock <= 10 && product.stock > 0 && (
          <p className="text-orange-600 text-xs mt-2">
            Only {product.stock} left in stock
          </p>
        )}
      </CardContent>
    </Card>
  );
}
