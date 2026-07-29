// components/recommended-section.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import Swiper from 'react-native-swiper';
import ProductCard from './product-card';

const { width } = Dimensions.get('window');

interface RecommendedSectionProps {
  products: any[];
  onProductPress: (id: string) => void;
  onWishlistPress: (id: string) => void;
}

const RecommendedSection: React.FC<RecommendedSectionProps> = ({ 
  products,
  onProductPress,
  onWishlistPress 
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (products.length === 0) return null;

  const chunkArray = (arr: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const chunkedProducts = chunkArray(products.slice(0, 6), 2);

  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-center px-4 mb-3">
        <View>
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recommended For You
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
            Curated just for students
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/explore' as any)}
          className="flex-row items-center"
        >
          <Text className="text-emerald-500 text-sm font-medium mr-1">See All</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 280 }}>
        <Swiper
          showsButtons={false}
          autoplay
          autoplayTimeout={4}
          showsPagination={false}
          loop
        >
          {chunkedProducts.map((chunk, index) => (
            <View key={index} className="flex-row flex-wrap justify-center px-4" style={{ width: width }}>
              {chunk.map((item: any) => (
                <View key={item._id} className="w-[46%] mx-[2%] mb-3">
                  <ProductCard
                    id={item._id}
                    title={item.title}
                    price={item.price}
                    condition={item.condition}
                    images={item.images}
                    location={item.location}
                    status={item.status}
                    onPress={() => onProductPress(item._id)}
                  />
                </View>
              ))}
            </View>
          ))}
        </Swiper>
      </View>
    </View>
  );
};

export default RecommendedSection;