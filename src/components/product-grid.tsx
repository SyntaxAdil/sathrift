// components/product-grid.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import ProductCard from './product-card';

interface ProductGridProps {
  products: any[];
  onProductPress: (id: string) => void;
  onWishlistPress: (id: string) => void;
  numColumns?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onProductPress, 
  onWishlistPress,
  numColumns = 2
}) => {
  if (!products || products.length === 0) return null;

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          id={item._id}
          title={item.title}
          price={item.price}
          condition={item.condition}
          images={item.images}
          location={item.location}
          isWishlisted={false}
          onPress={() => onProductPress(item._id)}
          onWishlistPress={() => onWishlistPress(item._id)}
        />
      )}
      keyExtractor={(item) => item._id}
      numColumns={numColumns}
      scrollEnabled={false}
      columnWrapperStyle={numColumns === 2 ? { 
        justifyContent: 'space-between', 
        paddingHorizontal: 16 
      } : undefined}
      contentContainerStyle={{ paddingBottom: 4 }}
    />
  );
};

export default ProductGrid;