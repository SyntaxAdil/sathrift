// components/profile/MyProducts.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import axios from 'axios';

interface Product {
  _id: string;
  title: string;
  price: number;
  condition: string;
  images: string[];
  status: string;
}

interface MyProductsProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onStatusChange: () => void;
  userId: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const MyProducts: React.FC<MyProductsProps> = ({ 
  products, 
  loading, 
  onEdit, 
  onDelete, 
  onStatusChange,
  userId 
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleStatusToggle = async (product: Product) => {
    const newStatus = product.status === 'available' ? 'sold' : 'available';
    const action = newStatus === 'sold' ? 'Mark as Sold' : 'Mark as Available';
    
    Alert.alert(
      action,
      `Are you sure you want to mark "${product.title}" as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await axios.patch(`${API_URL}/api/product/${product._id}/status`, {
                status: newStatus,
                sellerId: userId
              });
              onStatusChange();
              Alert.alert('Success', `Product marked as ${newStatus}`);
            } catch (error) {
              Alert.alert('Error', 'Failed to update status');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="py-8 items-center">
        <ActivityIndicator size="small" color="#22C55E" />
      </View>
    );
  }

  return (
    <View className={`mx-4 mt-4 p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          My Products ({products.length})
        </Text>
        <TouchableOpacity 
          onPress={() => router.push('/sell')} 
          className="flex-row items-center bg-emerald-500 px-3 py-1.5 rounded-full"
        >
          <Feather name="plus" size={16} color="white" />
          <Text className="text-white text-sm font-medium ml-1">Add</Text>
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <View className="py-8 items-center">
          <Feather name="package" size={40} color="#94A3B8" />
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            No products listed yet
          </Text>
        </View>
      ) : (
        products.map((item) => (
          <View key={item._id} className={`py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/product/[id]', params: { id: item._id } })}
                className="flex-row items-center flex-1"
              >
                <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/60' }} className="w-16 h-16 rounded-xl" resizeMode="cover" />
                <View className="flex-1 ml-3">
                  <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    ${item.price} · {item.condition}
                  </Text>
                  <View className={`px-2 py-0.5 rounded-full self-start mt-1 ${item.status === 'available' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    <Text className={`text-xs ${item.status === 'available' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity
                  onPress={() => handleStatusToggle(item)}
                  className={`p-2 rounded-full ${item.status === 'available' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}
                >
                  <Feather 
                    name={item.status === 'available' ? 'check-circle' : 'rotate-ccw'} 
                    size={16} 
                    color={item.status === 'available' ? '#F59E0B' : '#22C55E'} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onEdit(item)}
                  className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                >
                  <Feather name="edit-2" size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(item)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full"
                >
                  <Feather name="trash-2" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

export default MyProducts;