// components/hero-slider.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-swiper';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

interface HeroSliderProps {
  products?: any[];
}

const BANNERS = [
  require('../../assets/images/banner1.png'),
  require('../../assets/images/banner2.png'),
  require('../../assets/images/banner3.png'),
  require('../../assets/images/banner4.png'),
  require('../../assets/images/banner5.png'),
];

const HeroSlider: React.FC<HeroSliderProps> = ({ products }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="mx-4 mb-6 mt-2" style={{ height: 210 }}>
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
        {BANNERS.map((banner, index) => (
          <TouchableOpacity
            key={index}
            className="relative rounded-xl overflow-hidden"
            style={{ width: width - 32, height: 200 }}
            activeOpacity={0.95}
          >
            <Image
              source={banner}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </Swiper>
    </View>
  );
};

export default HeroSlider;