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
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(
    null,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );

  const handleLogin = async () => {
    if (!email.trim()) return Alert.alert("Error", "Email is required");
    if (!password.trim()) return Alert.alert("Error", "Password is required");

    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });

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

  const mutedIcon = isDark ? "#6B7280" : "#9CA3AF";
  const subtleIcon = isDark ? "#9CA3AF" : "#64748B";

  const fieldBorder = (field: "email" | "password") =>
    focusedField === field
      ? "border-emerald-500"
      : isDark
        ? "border-gray-700"
        : "border-gray-200";
  const handleSocialLogin = async (provider: "google" | "apple") => {
    setSocialLoading(provider);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/(tabs)",
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setSocialLoading(null);
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
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-16 pb-8 gap-8">
            {/* Logo */}
            <View className="items-center">
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-32 h-12"
                resizeMode="contain"
              />
            </View>

            {/* Header */}
            <View className="gap-1.5">
              <Text
                className={`text-3xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome Back
              </Text>
              <Text
                className={`text-base ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Continue your sustainable luxury journey
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              <View className="gap-1.5">
                <Text
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email Address
                </Text>
                <View
                  className={`flex-row items-center gap-2.5 ${
                    isDark ? "bg-gray-800" : "bg-gray-50"
                  } rounded-xl px-4 py-3.5 border ${fieldBorder("email")}`}
                >
                  <Feather name="mail" size={18} color={mutedIcon} />
                  <TextInput
                    className={`flex-1 text-base ${isDark ? "text-white" : "text-gray-900"}`}
                    placeholder="name@example.com"
                    placeholderTextColor={mutedIcon}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View className="gap-1.5">
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-emerald-500 text-sm font-medium">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  className={`flex-row items-center gap-2.5 ${
                    isDark ? "bg-gray-800" : "bg-gray-50"
                  } rounded-xl px-4 py-3.5 border ${fieldBorder("password")}`}
                >
                  <Feather name="lock" size={18} color={mutedIcon} />
                  <TextInput
                    className={`flex-1 text-base ${isDark ? "text-white" : "text-gray-900"}`}
                    placeholder="Enter your password"
                    placeholderTextColor={mutedIcon}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color={mutedIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Sign in */}
            <View className="gap-6">
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
                className="bg-emerald-500 rounded-xl py-4 items-center shadow-sm"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center gap-3">
                <View
                  className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                />
                <Text
                  className={`text-xs font-medium tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  OR CONTINUE WITH
                </Text>
                <View
                  className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => handleSocialLogin("google")}
                  disabled={socialLoading !== null || loading}
                  activeOpacity={0.85}
                  className={`flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-xl border ${
                    isDark
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {socialLoading === "google" ? (
                    <ActivityIndicator size="small" color={subtleIcon} />
                  ) : (
                    <>
                      <FontAwesome name="google" size={18} color="#EA4335" />
                      <Text
                        className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                      >
                        Google
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialLogin("apple")}
                  disabled={socialLoading !== null || loading}
                  activeOpacity={0.85}
                  className={`flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-xl border ${
                    isDark
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {socialLoading === "apple" ? (
                    <ActivityIndicator size="small" color={subtleIcon} />
                  ) : (
                    <>
                      <FontAwesome
                        name="apple"
                        size={20}
                        color={isDark ? "#FFFFFF" : "#000000"}
                      />
                      <Text
                        className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-700"}`}
                      >
                        Apple
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center items-center gap-1 mt-auto">
              <Text
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text className="text-emerald-500 font-semibold text-sm">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
