// components/explore-more.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

interface ExploreMoreProps {
  title?: string;
  subtitle?: string;
}

const ExploreMore: React.FC<ExploreMoreProps> = ({ 
  title = "Discover More",
  subtitle = "Find amazing deals from fellow students" 
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="mx-4 mb-6">
      <TouchableOpacity
        className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-emerald-50'}`}
        onPress={() => router.push('/explore' as any)}
        activeOpacity={0.9}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              {subtitle}
            </Text>
          </View>
          <View className={`w-12 h-12 rounded-full ${isDark ? 'bg-gray-700' : 'bg-white'} items-center justify-center`}>
            <Feather name="arrow-right" size={24} color="#22C55E" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ExploreMore;