// components/RecentProducts.tsx
import React, { useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import ProductCard from './product-card';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface RecentProductsProps {
  products: any[];
  onProductPress: (id: string) => void;
  onWishlistPress: (id: string) => void;
}

const RecentProducts: React.FC<RecentProductsProps> = ({
  products,
  onProductPress,
  onWishlistPress
}) => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  if (products.length === 0) return null;

  const scrollLeft = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const scrollRight = () => {
    const itemWidth = 163;
    flatListRef.current?.scrollToOffset({
      offset: Math.min(products.length * itemWidth, (products.length - 3) * itemWidth),
      animated: true
    });
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center px-4 mb-3">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold dark:text-white">🕐 Recent Listings</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/explore')}>
          <Text className="text-emerald-400 text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View className="mr-3" style={{ width: 150 }}>
            <ProductCard
              id={item._id}
              title={item.title}
              price={item.price}
              condition={item.condition}
              images={item.images}
              location={item.location}
              // isWishlisted={false}
              onPress={() => onProductPress(item._id)}
              // onWishlistPress={() => onWishlistPress(item._id)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default RecentProducts;