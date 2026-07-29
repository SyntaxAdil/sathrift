// components/header.tsx
import React from "react";
import { View, Image, TouchableOpacity, Text, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from 'react-native';
import { authClient } from "../lib/auth-client";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  showBack = false,
  title,
}) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isLoggedIn = !!session;

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className={`flex-row items-center justify-between px-5 py-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <View className="flex-row items-center">
          {showBack && (
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Feather name="arrow-left" size={24} color={isDark ? "#FFFFFF" : "#1F2937"} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push('/')}>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-32 h-10"
              resizeMode="contain"
            />
          </TouchableOpacity>
          {title && (
            <Text className={`ml-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </Text>
          )}
        </View>
        
        {isLoggedIn ? (
          <TouchableOpacity 
            onPress={handleProfilePress}
            className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center overflow-hidden"
          >
            {session.user?.image ? (
              <Image 
                source={{ uri: session.user.image }} 
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-white text-base font-bold">
                {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              className="px-4 py-2 rounded-full bg-emerald-500 "
            >
              <Text className="text-white text-sm font-semibold">Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/register')}
              className="px-4 py-2 rounded-full border border-emerald-500"
            >
              <Text className="text-emerald-500 text-sm font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

export default Header;