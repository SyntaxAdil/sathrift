// components/CategorySection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CategorySectionProps {
  onCategoryPress: (category: string) => void;
}

const categories = [
  { id: '1', name: 'Electronics', icon: 'smartphone' },
  { id: '2', name: 'Fashion', icon: 'shopping-bag' },
  { id: '3', name: 'Books', icon: 'book-open' },
  { id: '4', name: 'Home', icon: 'home' },
  { id: '5', name: 'Sports', icon: 'activity' },
  { id: '6', name: 'Vehicles', icon: 'truck' },
];

const CategorySection: React.FC<CategorySectionProps> = ({ onCategoryPress }) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold dark:text-white">Categories</Text>
        <TouchableOpacity onPress={() => onCategoryPress('all')}>
          <Text className="text-emerald-400 text-sm font-medium">See All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className="items-center mr-4"
            onPress={() => onCategoryPress(category.name)}
          >
            <View className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full items-center justify-center">
              <Feather name={category.icon as any} size={24} color="#34D399" />
            </View>
            <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategorySection;