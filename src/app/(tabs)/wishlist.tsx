// app/(tabs)/wishlist/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { authClient } from '../../lib/auth-client';
import Header from '../../components/header';
import EmptyState from '../../components/empty-state';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    condition: string;
    images: string[];
    location: string;
    status: string;
  };
  createdAt: string;
}

export default function WishlistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { data: session } = authClient.useSession();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchWishlist = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/wishlist?userId=${session?.user?.id}`);
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWishlist();
  }, [session]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [session])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchWishlist();
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/api/wishlist/${productId}`, {
                data: { userId: session?.user?.id }
              });
              // Update local state immediately
              setWishlist(prev => prev.filter(item => item.product._id !== productId));
            } catch (error) {
              Alert.alert('Error', 'Failed to remove item');
            }
          }
        }
      ]
    );
  };

  const handleProductPress = (productId: string) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: productId }
    });
  };

  const renderWishlistItem = ({ item }: { item: WishlistItem }) => (
    <TouchableOpacity
      onPress={() => handleProductPress(item.product._id)}
      activeOpacity={0.95}
      className="mb-4"
      style={{ width: CARD_WIDTH }}
    >
      <View className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <View className="relative h-52 bg-gray-100 dark:bg-gray-700">
          <Image
            source={{ uri: item.product.images?.[0] || 'https://via.placeholder.com/200' }}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            locations={[0.4, 1]}
            className="absolute inset-0"
          />

          <View className="absolute top-3 left-3 bg-emerald-500 px-2.5 py-1 rounded-full">
            <Text className="text-white text-[10px] font-bold tracking-wide">
              {item.product.condition?.toUpperCase() || 'USED'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleRemoveFromWishlist(item.product._id)}
            className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full shadow-lg"
          >
            <Feather name="heart" size={18} color="#EF4444" fill="#EF4444" />
          </TouchableOpacity>

          <View className="absolute bottom-0 left-0 right-0 p-3">
            <Text className="text-white text-base font-bold" numberOfLines={1}>
              {item.product.title}
            </Text>
            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-emerald-400 text-xl font-bold">
                BDT {item.product.price?.toFixed(2)}
              </Text>
              {item.product.location && (
                <View className="flex-row items-center bg-white/15 px-2 py-0.5 rounded-full">
                  <Feather name="map-pin" size={10} color="white" />
                  <Text className="text-white text-[10px] ml-1" numberOfLines={1}>
                    {item.product.location}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!session) {
    return (
      <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header />
        <View className="flex-1 items-center justify-center p-6">
          <Feather name="heart" size={64} color="#94A3B8" />
          <Text className={`text-lg font-semibold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sign In Required
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1 text-center`}>
            Please sign in to view your wishlist
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            className="mt-6 bg-emerald-500 px-8 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      {wishlist.length === 0 ? (
        <EmptyState 
          icon="heart"
          title="Your wishlist is empty"
          description="Start saving your favorite items by tapping the heart icon on products"
        />
      ) : (
        <>
          <View className="px-4 pt-4 pb-3 mb-4 flex-row items-center justify-between">
            <View>
              <Text className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Wishlist
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </Text>
            </View>
          </View>

          <FlatList
            data={wishlist}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22C55E']} />
            }
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}