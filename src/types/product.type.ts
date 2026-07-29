// types/product.type.ts
export interface Product {
  _id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Used';
  images: string[];
  location: string;
  sellerId?: string;
  sellerName?: string;
  sellerImage?: string;
  sellerWhatsapp?: string;
  status: 'available' | 'sold';
  views: number;
  createdAt?: Date;
  updatedAt?: Date;
}