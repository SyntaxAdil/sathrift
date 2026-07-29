// components/recommended-section.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import ProductCard from './product-card';

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

  return (
    <View className="mb-6">
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
          className="flex-row items-center "
        >
          <Text className="text-emerald-500 text-sm font-medium mr-1">See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={products.slice(0, 6)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View className="mr-15" style={{ width: 150 }}>
            <ProductCard
              id={item._id}
              title={item.title}
              price={item.price}
              condition={item.condition}
              images={item.images}
              location={item.location}
              
              onPress={() => onProductPress(item._id)}
              status={item.status}
            />
          </View>
        )}
      />
    </View>
  );
};

export default RecommendedSection;