// components/LoadingScreen.tsx
import React, { useEffect, useRef , useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center px-6`}>
      <LinearGradient
        colors={['#22C55E', '#10B981']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
      >
        <Text className="text-white text-2xl font-bold">S</Text>
      </LinearGradient>

      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <View className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
      </Animated.View>

      <Text className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {message}
      </Text>
    </View>
  );
};

export default LoadingScreen;