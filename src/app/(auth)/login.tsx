// app/(auth)/login.tsx
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

export default function Login() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) return Alert.alert("Error", "Email is required");
    if (!password.trim()) return Alert.alert("Error", "Password is required");

    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }

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
            <View className="items-center mb-6">
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-32 h-12"
                resizeMode="contain"
              />
            </View>

            <View className="mb-6">
              <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Welcome Back
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
                Continue your sustainable luxury journey
              </Text>
            </View>

            <View>
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

              <View className="mb-1">
                <Text className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                  Password
                </Text>
                <View className={`flex-row items-center ${isDark ? "bg-gray-800" : "bg-gray-50"} rounded-xl px-3 border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <Feather name="lock" size={18} color={isDark ? "#6B7280" : "#9CA3AF"} />
                  <TextInput
                    className={`flex-1 py-3 ml-2 ${isDark ? "text-white" : "text-gray-900"}`}
                    placeholder="Enter your password"
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

              <TouchableOpacity className="self-end mt-2">
                <Text className="text-emerald-500 text-sm font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="mt-6 bg-emerald-500 rounded-xl py-3.5 items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Sign In</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center mt-6">
              <View className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              <Text className={`mx-3 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                OR CONTINUE WITH
              </Text>
              <View className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
            </View>

            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
              >
                <Feather name="mail" size={18} color={isDark ? "#9CA3AF" : "#64748B"} />
                <Text className={`ml-2 text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
                  Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
              >
                <Feather name="user" size={18} color={isDark ? "#9CA3AF" : "#64748B"} />
                <Text className={`ml-2 text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
                  Apple
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-6">
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text className="text-emerald-500 font-semibold">Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}