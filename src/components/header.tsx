import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, StatusBar, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const [imageError, setImageError] = useState(false);

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const getUserInitial = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View
        style={{ paddingTop: insets.top + 12 }}
        className={`flex-row items-center justify-between px-5 pb-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
      >
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
            style={[
              styles.avatarContainer,
              { backgroundColor: '#22C55E' }
            ]}
            activeOpacity={0.7}
          >
            {session.user?.image && !imageError ? (
              <Image
                source={{ uri: session.user.image }}
                style={styles.avatarImage}
                resizeMode="cover"
                onError={() => setImageError(true)}
                // Add these props for better image handling
                defaultSource={require('../../assets/images/default-avatar.jpg')}
              />
            ) : (
              <Text style={styles.avatarText}>
                {getUserInitial()}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="px-4 py-2 rounded-full bg-emerald-500"
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

const styles = StyleSheet.create({
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // Fix for potential rendering issues
    backgroundColor: '#22C55E',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    // Ensure image is not transformed
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;