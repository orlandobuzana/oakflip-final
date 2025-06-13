import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Star, Heart, Minus, Plus, Check } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductModal() {
  const { selectedProduct, isProductModalOpen, closeProductModal } = useProduct();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
      });
    }
    toast({
      title: "Added to cart",
      description: `${quantity} ${selectedProduct.name}(s) added to your cart.`,
    });
    closeProductModal();
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${selectedProduct.name} has been added to your wishlist.`,
    });
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

  const images = selectedProduct.images || [selectedProduct.image];

  return (
    <Dialog open={isProductModalOpen} onOpenChange={closeProductModal}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {selectedProduct.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4">
              <img
                src={images[selectedImage]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 bg-slate-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      index === selectedImage ? "border-primary" : "border-transparent"
                    } hover:border-primary transition-colors`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${selectedProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {renderStars(selectedProduct.rating || "0")}
                </div>
                <span className="text-slate-500 text-sm ml-2">
                  ({selectedProduct.reviewCount || 0} reviews)
                </span>
              </div>
              
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl font-bold text-slate-800">
                  {formatPrice(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-lg text-slate-500 line-through">
                    {formatPrice(selectedProduct.originalPrice)}
                  </span>
                )}
                {selectedProduct.originalPrice && (
                  <Badge className="bg-red-500 text-white">Sale</Badge>
                )}
              </div>
              
              <p className="text-slate-600 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {selectedProduct.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <Check className="w-4 h-4 mr-1" />
                  <span className="text-sm">In Stock ({selectedProduct.stock} available)</span>
                </div>
              ) : (
                <div className="text-red-600 text-sm">Out of Stock</div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0"
                  onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                  disabled={quantity >= selectedProduct.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={selectedProduct.stock === 0}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6"
                onClick={handleAddToWishlist}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Product Features */}
            {selectedProduct.features && selectedProduct.features.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">Key Features</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  {selectedProduct.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
