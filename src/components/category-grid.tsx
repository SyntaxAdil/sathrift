// components/category-grid.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface CategoryGridProps {
  onCategoryPress?: (category: string) => void;
}

const categories = [
  { id: '1', name: 'Electronics', icon: 'smartphone', color: '#22C55E' },
  { id: '2', name: 'Fashion', icon: 'shopping-bag', color: '#3B82F6' },
  { id: '3', name: 'Books', icon: 'book', color: '#8B5CF6' },
  { id: '4', name: 'Home', icon: 'home', color: '#F59E0B' },
  { id: '5', name: 'Sports', icon: 'activity', color: '#EF4444' },
  { id: '6', name: 'Vehicles', icon: 'truck', color: '#06B6D4' },
  { id: '7', name: 'Accessories', icon: 'watch', color: '#EC4899' },
  { id: '8', name: 'Other', icon: 'more-horizontal', color: '#6B7280' },
];

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryPress }) => {
  const router = useRouter();

  const handlePress = (categoryName: string) => {
    if (onCategoryPress) {
      onCategoryPress(categoryName);
    }
    router.push({
      pathname: '/explore',
      params: { category: categoryName }
    });
  };

  return (
    <View className="mb-6 px-4">
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Categories
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className="w-[23%] items-center mb-4"
            onPress={() => handlePress(category.name)}
            activeOpacity={0.7}
          >
            <View 
              className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
              style={{ backgroundColor: `${category.color}15` }}
            >
              <Feather name={category.icon as any} size={24} color={category.color} />
            </View>
            <Text className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CategoryGrid;