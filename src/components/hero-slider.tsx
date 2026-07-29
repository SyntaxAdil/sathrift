// components/hero-slider.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-swiper';
import { useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface HeroSliderProps {
  products: any[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ products }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!products || products.length === 0) return null;

  return (
    <View className="mx-4 mb-6 mt-2 " style={{ height: 210 }}>
      <Swiper
        style={{ height: 210 }}
        showsButtons={false}
        autoplay
        autoplayTimeout={4}
        dotColor={isDark ? "#374151" : "#E2E8F0"}
        activeDotColor="#22C55E"
        dotStyle={{ width: 6, height: 6, borderRadius: 3 }}
        activeDotStyle={{ width: 20, height: 6, borderRadius: 3 }}
        paginationStyle={{ bottom: 12 }}
      >
        {products.slice(0, 5).map((item) => (
          <TouchableOpacity
            key={item._id}
            className="relative rounded-xl overflow-hidden"
            style={{ width: width - 32, height: 200 }}
            onPress={() => router.push({
              pathname: '/product/[id]',
              params: { id: item._id }
            })}
            activeOpacity={0.95}
          >
            <Image
              source={{ uri: item.images?.[0] || 'https://via.placeholder.com/400x300' }}
              className="w-full h-full"
              resizeMode="cover"
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              locations={[0.5, 1]}
              className="absolute inset-0"
            />
            
            <View className="absolute top-3 left-3 bg-emerald-500 px-2.5 py-1 rounded-full">
              <Text className="text-white text-[10px] font-bold tracking-wide">
                {item.condition?.toUpperCase() || 'FEATURED'}
              </Text>
            </View>
            
            <View className="absolute bottom-0 left-0 right-0 p-4">
              <Text className="text-white text-base font-bold" numberOfLines={1}>
                {item.title}
              </Text>
              <View className="flex-row items-center justify-between mt-1.5">
                <Text className="text-emerald-400 text-xl font-bold">
                  ${item.price?.toFixed(2)}
                </Text>
                <View className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Text className="text-white/70 text-[10px] font-medium">
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