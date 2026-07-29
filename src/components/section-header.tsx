// components/section-header.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  seeAllText?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  onSeeAll, 
  seeAllText = 'See All' 
}) => {
  return (
    <View className="flex-row justify-between items-center px-4 mb-3">
      <Text className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} className="flex-row items-center">
          <Text className="text-emerald-500 text-sm font-medium mr-1">
            {seeAllText}
          </Text>
          <Feather name="chevron-right" size={16} color="#22C55E" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;