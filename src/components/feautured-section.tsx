// components/FeaturedSection.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ProductCard from './product-card';


interface FeaturedSectionProps {
  products: any[];
  onProductPress: (id: string) => void;
  onWishlistPress: (id: string) => void;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ 
  products, 
  onProductPress,
  onWishlistPress 
}) => {
  const router = useRouter();

  if (products.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3 px-1">
        <Text className="text-lg font-bold dark:text-white">🔥 Featured</Text>
        <TouchableOpacity onPress={() => router.push('/explore')}>
          <Text className="text-emerald-400 text-sm font-medium">See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="mr-3" style={{ width: 150 }}>
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
          </View>
        )}
      />
    </View>
  );
};

export default FeaturedSection;