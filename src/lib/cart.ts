// Shopping cart functionality with localStorage
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  price_at_purchase: number;
  purchased_at: string;
}

class CartService {
  private readonly CART_KEY = 'ecofinds_cart';
  private readonly PURCHASES_KEY = 'ecofinds_purchases';

  getCartItems(userId: string): CartItem[] {
    const items = localStorage.getItem(this.CART_KEY);
    const cartItems: CartItem[] = items ? JSON.parse(items) : [];
    return cartItems.filter(item => item.user_id === userId);
  }

  addToCart(userId: string, productId: string, quantity: number = 1): CartItem {
    const cartItems = this.getAllCartItems();
    const existingItem = cartItems.find(
      item => item.user_id === userId && item.product_id === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        user_id: userId,
        product_id: productId,
        quantity,
        added_at: new Date().toISOString()
      };
      cartItems.push(newItem);
    }

    localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems));
    return existingItem || cartItems[cartItems.length - 1];
  }

  removeFromCart(userId: string, productId: string): boolean {
    const cartItems = this.getAllCartItems();
    const filteredItems = cartItems.filter(
      item => !(item.user_id === userId && item.product_id === productId)
    );

    if (filteredItems.length === cartItems.length) return false;

    localStorage.setItem(this.CART_KEY, JSON.stringify(filteredItems));
    return true;
  }

  updateQuantity(userId: string, productId: string, quantity: number): boolean {
    const cartItems = this.getAllCartItems();
    const item = cartItems.find(
      item => item.user_id === userId && item.product_id === productId
    );

    if (!item) return false;

    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    item.quantity = quantity;
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems));
    return true;
  }

  clearCart(userId: string): void {
    const cartItems = this.getAllCartItems();
    const filteredItems = cartItems.filter(item => item.user_id !== userId);
    localStorage.setItem(this.CART_KEY, JSON.stringify(filteredItems));
  }

  checkout(userId: string, cartItems: CartItem[], products: any[]): Purchase[] {
    const purchases: Purchase[] = [];
    const existingPurchases = this.getPurchases(userId);

    cartItems.forEach(cartItem => {
      const product = products.find(p => p.id === cartItem.product_id);
      if (product) {
        const purchase: Purchase = {
          id: Date.now().toString() + '_' + cartItem.product_id,
          user_id: userId,
          product_id: cartItem.product_id,
          price_at_purchase: product.price,
          purchased_at: new Date().toISOString()
        };
        purchases.push(purchase);
      }
    });

    const allPurchases = [...existingPurchases, ...purchases];
    localStorage.setItem(this.PURCHASES_KEY, JSON.stringify(allPurchases));
    this.clearCart(userId);

    return purchases;
  }

  getPurchases(userId: string): Purchase[] {
    const purchases = localStorage.getItem(this.PURCHASES_KEY);
    const allPurchases: Purchase[] = purchases ? JSON.parse(purchases) : [];
    return allPurchases
      .filter(purchase => purchase.user_id === userId)
      .sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime());
  }

  private getAllCartItems(): CartItem[] {
    const items = localStorage.getItem(this.CART_KEY);
    return items ? JSON.parse(items) : [];
  }
}

export const cartService = new CartService();