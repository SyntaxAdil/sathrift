// components/student-picks.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProductCard from './product-card';

interface StudentPicksProps {
  products: any[];
  onProductPress: (id: string) => void;
  onWishlistPress: (id: string) => void;
}

const StudentPicks: React.FC<StudentPicksProps> = ({ 
  products,
  onProductPress,
  onWishlistPress 
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (products.length === 0) return null;

  const topPicks = products.slice(0, 4);

  return (
    <View className="mb-6 px-4">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Feather name="star" size={20} color="#F59E0B" />
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} ml-2`}>
            Student Picks
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/explore' as any)}
          className="flex-row items-center"
        >
          <Text className="text-emerald-500 text-sm font-medium mr-1">See All</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row flex-wrap justify-between">
        {topPicks.map((item) => (
          <View key={item._id} className="w-[48%] mb-3">
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
        ))}
      </View>
    </View>
  );
};

export default StudentPicks;