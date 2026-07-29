// app/profile/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, Alert, ActivityIndicator, StatusBar, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { authClient } from '../../lib/auth-client';
import axios from 'axios';
import EditProfileModal from '../../components/profile/EditProfileModal';
import EditProductModal from '../../components/profile/EditProductModal';
import DeleteConfirmationModal from '../../components/profile/DeleteConfirmationModal';
import MyProducts from '../../components/profile/MyProducts';

interface Product {
  _id: string;
  title: string;
  price: number;
  condition: string;
  images: string[];
  status: string;
  description?: string;
  category?: string;
  location?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { data: session, refetch } = authClient.useSession();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editProductVisible, setEditProductVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updating, setUpdating] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchMyProducts = async () => {
    if (!session?.user?.id) return;
    try {
      const response = await axios.get(`${API_URL}/api/my-products?sellerId=${session?.user?.id}`);
      if (response.data.success) {
        setMyProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      fetchMyProducts();
    }, [session])
  );

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    fetchMyProducts();
  };

  const handleUpdateProfile = async (name: string, image: string, university: string, phoneNumber: string) => {
    setUpdating(true);
    try {
      // Update user with additional fields
      const updateData: any = {
        name: name,
        image: image || session?.user?.image,
      };
      
      // Add additional fields if they exist in the session user
      if (phoneNumber !== undefined) {
        updateData.phoneNumber = phoneNumber;
      }
      if (university !== undefined) {
        updateData.university = university;
      }
      
      await authClient.updateUser(updateData);
      await refetch();
      setEditProfileVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
      fetchMyProducts();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProduct = async (data: any) => {
    try {
      await axios.patch(`${API_URL}/api/product/${selectedProduct?._id}`, {
        ...data,
        sellerId: session?.user?.id,
      });
      setEditProductVisible(false);
      fetchMyProducts();
      Alert.alert('Success', 'Product updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update product');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${API_URL}/api/product/${selectedProduct?._id}`, {
        data: { sellerId: session?.user?.id }
      });
      setDeleteVisible(false);
      fetchMyProducts();
      Alert.alert('Success', 'Product deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authClient.signOut();
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  if (!session) {
    return (
      <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View className="flex-1 items-center justify-center p-6">
          <Feather name="user" size={64} color="#94A3B8" />
          <Text className={`text-lg font-semibold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Not Logged In
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1 text-center`}>
            Please sign in to view your profile
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

  // Get additional fields from session user directly (Better Auth adds them to user object)
  const user = session.user as any;
  const phoneNumber = user?.phoneNumber || '';
  const university = user?.university || '';

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View className="px-5 pt-12 pb-4 flex-row justify-between items-center">
        <Pressable onPress={()=>router.push("/")}>

        <Text  className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Profile
        </Text>
        </Pressable>
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center bg-red-500 px-4 py-2 rounded-full"
        >
          <Feather name="log-out" size={18} color="white" />
          <Text className="text-white font-semibold ml-2 text-sm">Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22C55E']} />}
      >
        <View className="mx-4 p-6 rounded-2xl bg-white dark:bg-gray-800">
          <View className="flex-row items-center">
            <View className="w-20 h-20 rounded-full bg-emerald-500 items-center justify-center overflow-hidden shadow-lg">
              {session.user?.image ? (
                <Image source={{ uri: session.user.image }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <Text className="text-white text-2xl font-bold">
                  {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              )}
            </View>
            <View className="ml-4 flex-1">
              <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {session.user?.name || 'User'}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                {session.user?.email || 'No email'}
              </Text>
              {phoneNumber && (
                <View className="flex-row items-center mt-0.5">
                  <Feather name="phone" size={14} color="#25D366" />
                  <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} ml-1`}>
                    {phoneNumber}
                  </Text>
                </View>
              )}
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>
                🎓 {university || 'Add your university'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={() => setEditProfileVisible(true)}
            className="mt-4 flex-row items-center justify-center bg-emerald-500 py-2.5 rounded-full"
          >
            <Feather name="edit-2" size={16} color="white" />
            <Text className="text-white font-semibold ml-2">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mx-4 mt-4 gap-3">
          <View className={`flex-1 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {myProducts.length}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Listings</Text>
          </View>
          <View className={`flex-1 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {myProducts.filter(p => p.status === 'available').length}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Available</Text>
          </View>
        </View>

        <MyProducts
          products={myProducts}
          loading={loading}
          onEdit={(product) => { setSelectedProduct(product); setEditProductVisible(true); }}
          onDelete={(product) => { setSelectedProduct(product); setDeleteVisible(true); }}
          onStatusChange={fetchMyProducts}
          userId={session.user?.id || ''}
        />

        <View className="h-8" />
      </ScrollView>

      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        onSave={handleUpdateProfile}
        initialName={session.user?.name || ''}
        initialEmail={session.user?.email || ''}
        initialImage={session.user?.image || ""}
        initialUniversity={university}
        initialPhoneNumber={phoneNumber}
        loading={updating}
      />

      <EditProductModal
        visible={editProductVisible}
        onClose={() => setEditProductVisible(false)}
        onSave={handleUpdateProduct}
        product={selectedProduct}
      />

      <DeleteConfirmationModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        onConfirm={handleDeleteProduct}
      />
    </View>
  );
}