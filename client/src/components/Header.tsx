import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Store,
  Menu,
  X
} from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { cartCount, openCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const navigation = [
    { name: "Products", href: "/products", current: location === "/products" },
    { name: "Categories", href: "/products", current: false },
    { name: "Deals", href: "/products", current: false },
    { name: "About", href: "/", current: false },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Store className="w-8 h-8 text-primary mr-2" />
              <span className="text-xl font-bold text-slate-800">ModernShop</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  item.current
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-700 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={openCart}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
            
            <Link href="/admin">
              <Button size="sm" className="hidden sm:flex">
                Admin Panel
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </form>
              
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    item.current
                      ? "text-primary bg-primary/10"
                      : "text-slate-700 hover:text-primary hover:bg-slate-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <Link href="/admin">
                <Button className="w-full mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
