// components/product-card.tsx
import React from 'react';
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
  isWishlisted?: boolean;
  onPress: () => void;
  onWishlistPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  condition,
  images,
  location,
  isWishlisted = false,
  onPress,
  
}) => {
  const conditionColors: Record<string, string> = {
    'New': '#22C55E',
    'Like New': '#3B82F6',
    'Good': '#F59E0B',
    'Fair': '#F97316',
    'Used': '#94A3B8',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mb-4"
      style={{ width: CARD_WIDTH }}
    >
      <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <View className="relative h-44 bg-gray-100 dark:bg-gray-700">
          {images?.[0] ? (
            <Image source={{ uri: images[0] }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Feather name="image" size={32} color="#CBD5E1" />
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

        

          <View className="absolute bottom-2 left-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Text className="text-white font-bold text-sm">
              ${price?.toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="p-3">
          <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-1" numberOfLines={2}>
            {title}
          </Text>
          {location && (
            <View className="flex-row items-center">
              <Feather name="map-pin" size={12} color="#94A3B8" />
              <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1" numberOfLines={1}>
                {location}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;