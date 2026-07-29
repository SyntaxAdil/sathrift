import { ObjectId } from "mongodb";

export interface Product {
  _id: string | ObjectId;
  title:string,
  description: string;
  price: number;
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair" | "Used";
  images: string[];
  location: string;
  sellerWhatsapp?: string;
  sellerId?: string;
  sellerName?: string;
  sellerImage?: string;
  status?: "available" | "sold";
  createdAt?: Date;
  updatedAt?: Date;
}