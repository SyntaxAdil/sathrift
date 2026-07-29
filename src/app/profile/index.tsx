// app/profile/index.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Alert, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { authClient } from '../../lib/auth-client';
import Header from '../../components/header';
import ProfileHeader from '../../components/profile/ProfileHeader';
import MyProducts from '../../components/profile/MyProducts';
import EditProfileModal from '../../components/profile/EditProfileModal';
import EditProductModal from '../../components/profile/EditProductModal';
import DeleteConfirmationModal from '../../components/profile/DeleteConfirmationModal';
import axios from 'axios';

interface Product {
  _id: string;
  title: string;
  price: number;
  condition: string;
  images: string[];
  status: string;
  description?: string;
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

  useEffect(() => {
    if (session?.user?.id) {
      fetchMyProducts();
    }
  }, [session]);

  const fetchMyProducts = async () => {
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyProducts();
  };

  const handleUpdateProfile = async (name: string, image: string) => {
    setUpdating(true);
    try {
      await authClient.updateUser({
        name: name,
        image: image || session?.user?.image,
      });
      await refetch();
      setEditProfileVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
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
        <Header />
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

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22C55E']} />}
      >
        <ProfileHeader
          name={session.user?.name || ''}
          email={session.user?.email || ''}
          image={session.user?.image || ""}
          onEditPress={() => setEditProfileVisible(true)}
        />

        <MyProducts
          products={myProducts}
          loading={loading}
          onEdit={(product) => { setSelectedProduct(product); setEditProductVisible(true); }}
          onDelete={(product) => { setSelectedProduct(product); setDeleteVisible(true); }}
        />

        <TouchableOpacity 
          onPress={handleLogout} 
          className="mx-4 mt-4 bg-red-500 py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-semibold text-base">Logout</Text>
        </TouchableOpacity>
        <View className="h-8" />
      </ScrollView>

      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        onSave={handleUpdateProfile}
        initialName={session.user?.name || ''}
        initialEmail={session.user?.email || ''}
        initialImage={session.user?.image || ""}
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