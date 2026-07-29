// components/profile/ProfileHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

interface ProfileHeaderProps {
  name: string;
  email: string;
  image?: string;
  onEditPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email, image, onEditPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`mx-4 mt-4 p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <View className="items-center">
        <View className="w-24 h-24 rounded-full bg-emerald-500 items-center justify-center overflow-hidden shadow-lg">
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className="text-white text-3xl font-bold">
              {name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          )}
        </View>
        <Text className={`text-xl font-bold mt-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {name || 'User'}
        </Text>
        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {email || 'No email'}
        </Text>
        <TouchableOpacity 
          onPress={onEditPress}
          className="mt-4 flex-row items-center bg-emerald-500 px-6 py-2.5 rounded-full"
        >
          <Feather name="edit-2" size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHeader;