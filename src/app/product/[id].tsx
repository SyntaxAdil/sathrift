// app/product/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <Feather name="alert-circle" size={48} color="#94A3B8" />
        <Text className="text-gray-500 dark:text-gray-400 mt-3">Product not found</Text>
        <TouchableOpacity 
          className="mt-4 bg-emerald-500 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-white dark:bg-gray-900">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image Section */}
          <View className="relative h-[420px] bg-gray-100 dark:bg-gray-800">
            <Image
              source={{ uri: product.images?.[0] || 'https://via.placeholder.com/400' }}
              className="w-full h-full"
              resizeMode="cover"
            />
            
            <View className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Back Button */}
            <TouchableOpacity 
              className="absolute top-14 left-4 w-10 h-10 bg-white/95 dark:bg-gray-800/95 rounded-full items-center justify-center shadow-lg"
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={22} color="#1F2937" />
            </TouchableOpacity>
            
            {/* Action Buttons */}
            <View className="absolute top-14 right-4 flex-row space-x-3">
              <TouchableOpacity className="w-10 h-10 bg-white/95 dark:bg-gray-800/95 rounded-full items-center justify-center shadow-lg">
                <Feather name="heart" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 bg-white/95 dark:bg-gray-800/95 rounded-full items-center justify-center shadow-lg">
                <Feather name="share-2" size={20} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {/* Condition Badge */}
            <View className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <Text className="text-white font-semibold text-sm tracking-wide">
                {product.condition?.toUpperCase() || 'AVAILABLE'}
              </Text>
            </View>
          </View>

          {/* Content Section */}
          <View className="px-5 pt-6 pb-8">
            {/* Title & Price */}
            <View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </Text>
              <Text className="text-3xl font-bold text-emerald-500 mt-2">
                ${product.price?.toFixed(2)}
              </Text>
            </View>

            {/* Location */}
            <View className="flex-row items-center mt-3">
              <Feather name="map-pin" size={16} color="#94A3B8" />
              <Text className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                {product.location || 'Location not specified'}
              </Text>
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-200 dark:bg-gray-700 my-5" />

            {/* Description */}
            <View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Description
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 leading-6">
                {product.description || 'No description available'}
              </Text>
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-200 dark:bg-gray-700 my-5" />

            {/* Seller Section */}
            <View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Seller
              </Text>
              <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                <View className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center">
                  <Text className="text-emerald-500 dark:text-emerald-400 font-bold text-xl">
                    {product.sellerName?.charAt(0)?.toUpperCase() || 'S'}
                  </Text>
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-900 dark:text-white font-semibold text-base">
                    {product.sellerName || 'Unknown Seller'}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Feather name="phone" size={14} color="#94A3B8" />
                    <Text className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                      {product.sellerWhatsapp || 'No WhatsApp'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity 
              className="mt-8 bg-emerald-500 py-4 rounded-2xl active:opacity-80 "
              onPress={() => {
                const whatsapp = product.sellerWhatsapp || '1234567890';
                // Open WhatsApp
              }}
            >
              <Text className="text-white text-center font-bold text-base tracking-wide">
                Contact on WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}