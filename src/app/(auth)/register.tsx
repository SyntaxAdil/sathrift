// app/(auth)/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function SignUp() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string): Promise<string | undefined> => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: uri,
        type: "image/jpeg",
        name: "profile.jpg",
      } as any);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.EXPO_PUBLIC_IMGBB_API}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      }
      return undefined;
    } catch (error) {
      console.error("Image upload error:", error);
      return undefined;
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) return Alert.alert("Error", "Name is required");
    if (!email.trim()) return Alert.alert("Error", "Email is required");
    if (!password.trim() || password.length < 6) {
      return Alert.alert("Error", "Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      let imageUrl = undefined;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl,
      });

      if (error) {
        Alert.alert("Register Failed", error.message);
        return;
      }

      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-12 pb-6">
            <View className="items-center mb-4">
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-32 h-12"
                resizeMode="contain"
              />
            </View>

            <View className="mb-5">
              <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Create Account
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
                Join the community and start thrifting
              </Text>
            </View>

            <View className="items-center mb-4">
              <TouchableOpacity onPress={pickImage} className="relative">
                <View className="w-20 h-20 rounded-full bg-emerald-500 items-center justify-center overflow-hidden">
                  {image ? (
                    <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <Feather name="user" size={32} color="white" />
                  )}
                </View>
                <View className="absolute bottom-0 right-0 bg-emerald-500 w-7 h-7 rounded-full items-center justify-center border-2 border-white dark:border-gray-900">
                  <Feather name="camera" size={14} color="white" />
                </View>
              </TouchableOpacity>
              <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mt-1.5`}>
                Tap to add profile photo
              </Text>
            </View>

            <View>
              <View className="mb-3">
                <Text className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Full Name
                </Text>
                <View className={`flex-row items-center ${isDark ? "bg-gray-800" : "bg-gray-50"} rounded-xl px-3 border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <Feather name="user" size={18} color={isDark ? "#6B7280" : "#9CA3AF"} />
                  <TextInput
                    className={`flex-1 py-3 ml-2 ${isDark ? "text-white" : "text-gray-900"}`}
                    placeholder="Enter your full name"
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View className="mb-3">
                <Text className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Email Address
                </Text>
                <View className={`flex-row items-center ${isDark ? "bg-gray-800" : "bg-gray-50"} rounded-xl px-3 border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <Feather name="mail" size={18} color={isDark ? "#6B7280" : "#9CA3AF"} />
                  <TextInput
                    className={`flex-1 py-3 ml-2 ${isDark ? "text-white" : "text-gray-900"}`}
                    placeholder="name@example.com"
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View className="mb-3">
                <Text className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Password
                </Text>
                <View className={`flex-row items-center ${isDark ? "bg-gray-800" : "bg-gray-50"} rounded-xl px-3 border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <Feather name="lock" size={18} color={isDark ? "#6B7280" : "#9CA3AF"} />
                  <TextInput
                    className={`flex-1 py-3 ml-2 ${isDark ? "text-white" : "text-gray-900"}`}
                    placeholder="Min 6 characters"
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color={isDark ? "#6B7280" : "#9CA3AF"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className="mt-5 bg-emerald-500 rounded-xl py-3.5 items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Create Account</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center mt-5">
              <View className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              <Text className={`mx-3 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                OR CONTINUE WITH
              </Text>
              <View className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
            </View>

            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
              >
                <Feather name="mail" size={18} color={isDark ? "#9CA3AF" : "#64748B"} />
                <Text className={`ml-2 text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
                  Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
              >
                <Feather name="user" size={18} color={isDark ? "#9CA3AF" : "#64748B"} />
                <Text className={`ml-2 text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
                  Apple
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-5">
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-emerald-500 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}