// Product management with localStorage
export interface Product {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image_url?: string;
  is_sold: boolean;
  created_at: string;
}

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Furniture',
  'Home Appliances',
  'Sports',
  'Collectibles',
  'Other'
];

// Mock products
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    owner_id: '1',
    title: 'Vintage MacBook Pro 2019',
    description: 'Well-maintained MacBook Pro with original charger. Perfect for students or remote work. Has some minor scratches but fully functional.',
    category: 'Electronics',
    price: 899,
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
    is_sold: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    owner_id: '1',
    title: 'Sustainable Cotton Jacket',
    description: 'Organic cotton jacket from Patagonia. Size M. Barely worn, perfect condition. Great for outdoor activities.',
    category: 'Clothing',
    price: 65,
    image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=400&fit=crop',
    is_sold: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    owner_id: '1',
    title: 'Collection of Programming Books',
    description: 'Set of 5 programming books including Clean Code, Design Patterns, and more. Great condition, no highlighting.',
    category: 'Books',
    price: 45,
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=400&fit=crop',
    is_sold: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    owner_id: '1',
    title: 'Ergonomic Office Chair',
    description: 'Herman Miller Aeron chair replica. Very comfortable, adjustable height and lumbar support. Minor wear on armrests.',
    category: 'Furniture',
    price: 275,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop',
    is_sold: false,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

class ProductService {
  private readonly STORAGE_KEY = 'ecofinds_products';

  constructor() {
    // Initialize products in localStorage if not exists
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
    }
  }

  getProducts(filters?: { category?: string; search?: string }): Product[] {
    let products = this.getAllProducts();

    if (filters?.category && filters.category !== 'All') {
      products = products.filter(p => p.category === filters.category);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    return products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getProduct(id: string): Product | null {
    const products = this.getAllProducts();
    return products.find(p => p.id === id) || null;
  }

  getUserProducts(userId: string): Product[] {
    const products = this.getAllProducts();
    return products.filter(p => p.owner_id === userId);
  }

  createProduct(productData: Omit<Product, 'id' | 'created_at'>): Product {
    const products = this.getAllProducts();
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };

    products.push(newProduct);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getAllProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    return products[index];
  }

  deleteProduct(id: string): boolean {
    const products = this.getAllProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) return false;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProducts));
    return true;
  }

  private getAllProducts(): Product[] {
    const products = localStorage.getItem(this.STORAGE_KEY);
    return products ? JSON.parse(products) : [];
  }
}

export const productService = new ProductService();