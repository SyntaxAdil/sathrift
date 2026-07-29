// components/empty-state.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = 'inbox', 
  title, 
  description 
}) => {
  return (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <View className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-4">
        <Feather name={icon as any} size={40} color="#94A3B8" />
      </View>
      <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
          {description}
        </Text>
      )}
    </View>
  );
};

export default EmptyState;