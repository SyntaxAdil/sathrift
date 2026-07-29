// components/profile/EditProductModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

interface Product {
  _id: string;
  title: string;
  price: number;
  condition: string;
  description?: string;
}

interface EditProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  product: Product | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  onClose,
  onSave,
  product
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [form, setForm] = useState({ title: '', price: '', description: '', condition: '' });

  React.useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        price: product.price.toString(),
        description: product.description || '',
        condition: product.condition,
      });
    }
  }, [product]);

  const handleSave = () => {
    onSave({
      ...form,
      price: parseFloat(form.price),
    });
  };

  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl p-6 pb-8 max-h-[80%]`}>
          <View className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full self-center mb-6" />
          
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit Product
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="space-y-4">
              <View>
                <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Title
                </Text>
                <TextInput
                  className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} p-4 rounded-xl`}
                  value={form.title}
                  onChangeText={(text) => setForm({ ...form, title: text })}
                  placeholder="Product title"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              <View>
                <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Price
                </Text>
                <TextInput
                  className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} p-4 rounded-xl`}
                  value={form.price}
                  onChangeText={(text) => setForm({ ...form, price: text })}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              <View>
                <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Condition
                </Text>
                <TextInput
                  className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} p-4 rounded-xl`}
                  value={form.condition}
                  onChangeText={(text) => setForm({ ...form, condition: text })}
                  placeholder="New, Like New, Good, etc."
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>

              <View>
                <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Description
                </Text>
                <TextInput
                  className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} p-4 rounded-xl`}
                  value={form.description}
                  onChangeText={(text) => setForm({ ...form, description: text })}
                  multiline
                  numberOfLines={4}
                  placeholder="Describe your product..."
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View className="flex-row space-x-3 mt-6">
              <TouchableOpacity 
                onPress={onClose} 
                className="flex-1 py-4 rounded-xl bg-gray-200 dark:bg-gray-700"
              >
                <Text className={`text-center font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSave} 
                className="flex-1 py-4 rounded-xl bg-emerald-500"
              >
                <Text className="text-white text-center font-semibold">Update</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditProductModal;