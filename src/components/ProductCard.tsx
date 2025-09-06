import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/products';
import { useAuth } from '@/contexts/AuthContext';
import { cartService } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (user?.id === product.owner_id) {
      toast({
        title: "Cannot add own item",
        description: "You cannot add your own items to the cart.",
        variant: "destructive",
      });
      return;
    }

    cartService.addToCart(user!.id, product.id);
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02] h-full">
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-12 h-12 mx-auto mb-2 bg-muted-foreground/10 rounded-full flex items-center justify-center">
                    <span className="text-lg">📦</span>
                  </div>
                  <p className="text-sm">No image</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Category Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm"
          >
            {product.category}
          </Badge>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/90 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>

          {/* Sold overlay */}
          {product.is_sold && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                SOLD
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(product.created_at)}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.is_sold || user?.id === product.owner_id}
            className="w-full"
            variant={product.is_sold ? "secondary" : "default"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.is_sold 
              ? "Sold Out" 
              : user?.id === product.owner_id 
                ? "Your Item" 
                : "Add to Cart"
            }
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};