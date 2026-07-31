// components/product-card.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  images: string[];
  location?: string;
  status?: string;
  onPress: () => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  condition,
  images,
  location,
  status ,
  onPress,
}) => {
  const [imageError, setImageError] = useState(false);
  
  const conditionColors: Record<string, string> = {
    'New': '#22C55E',
    'Like New': '#3B82F6',
    'Good': '#F59E0B',
    'Fair': '#F97316',
    'Used': '#94A3B8',
  };
  const hasValidImage = images && Array.isArray(images) && images.length > 0 && images[0] && !imageError;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mb-4"
      style={{ width: CARD_WIDTH }}
    >
      <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
        <View className="relative h-44 bg-gray-200 dark:bg-gray-700">
          {hasValidImage ? (
            <Image 
              source={{ uri: images[0] }} 
              className="w-full h-full" 
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-200 dark:bg-gray-700">
              <Feather name="image" size={40} color="#9CA3AF" />
            </View>
          )}
          <View 
            className="absolute top-2 left-2 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: conditionColors[condition] || '#94A3B8' }}
          >
            <Text className="text-white text-[10px] font-bold">
              {condition?.toUpperCase() || 'USED'}
            </Text>
          </View>
          {status === 'sold' && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center">
              <View className="bg-red-500 px-4 py-1.5 rounded-full transform -rotate-12">
                <Text className="text-white font-bold text-sm tracking-wider">SOLD</Text>
              </View>
            </View>
          )}
        </View>
        <View className="p-3">
          <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-1" numberOfLines={2}>
            {title || 'Untitled'}
          </Text>
          {location && (
            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={12} color="#94A3B8" />
              <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1" numberOfLines={1}>
                {location}
              </Text>
            </View>
          )}
          <View className="flex-row items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <View className="flex-row items-baseline">
              <Text className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mr-0.5">
                BDT
              </Text>
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                {price?.toFixed(2) || '0.00'}
              </Text>
            </View>
            <View className={`px-2.5 py-1 rounded-full ${status === 'available' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <Text className={`text-[10px] font-semibold ${status === 'available' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} capitalize`}>
                {status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ProductCard;