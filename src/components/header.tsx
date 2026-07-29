// components/header.tsx
import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  rightIcon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  showBack = false,
  title,
  rightIcon,
}) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <View className="flex-row items-center">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-30 h-10"
          resizeMode="contain"
        />
        {title && (
          <Text className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Header;
