// components/hero-slider.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

interface HeroSliderProps {
  products: any[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ products }) => {
  const router = useRouter();

  if (!products || products.length === 0) return null;

  return (
    <View className="mx-4 mb-6" style={{ height: 200 }}>
      <Swiper
        style={{ height: 200 }}
        showsButtons={false}
        autoplay
        autoplayTimeout={5}
        dotColor="#E2E8F0"
        activeDotColor="#22C55E"
        dotStyle={{ width: 8, height: 8, borderRadius: 4 }}
        activeDotStyle={{ width: 24, height: 8, borderRadius: 4 }}
        paginationStyle={{ bottom: 12 }}
      >
        {products.slice(0, 5).map((item) => (
          <TouchableOpacity
            key={item._id}
            className="relative rounded-2xl overflow-hidden"
            style={{ width: width - 32, height: 190 }}
            onPress={() => router.push({
              pathname: '/product/[id]',
              params: { id: item._id }
            })}
            activeOpacity={0.95}
          >
            <Image
              source={{ uri: item.images?.[0] || 'https://via.placeholder.com/400' }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <View className="absolute top-4 left-4 bg-emerald-500 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold tracking-wide">
                {item.condition?.toUpperCase() || 'FEATURED'}
              </Text>
            </View>
            
            <View className="absolute bottom-0 left-0 right-0 p-5">
              <Text className="text-white text-xl font-bold" numberOfLines={1}>
                {item.title}
              </Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-emerald-400 text-2xl font-bold">
                  ${item.price?.toFixed(2)}
                </Text>
                <View className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  <Text className="text-white text-xs font-semibold">
                    {item.location || 'Local'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Swiper>
    </View>
  );
};

export default HeroSlider;