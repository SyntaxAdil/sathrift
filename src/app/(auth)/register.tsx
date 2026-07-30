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
  useColorScheme,
  Button,
} from "react-native";
import { Link, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { authClient } from "@/lib/auth-client";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
export default function SignUp() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<
    "name" | "email" | "password" | null
  >(null);

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

  // Uses FileSystem.uploadAsync instead of fetch+FormData —
  // avoids the "Unsupported FormDataPart implementation" crash
  // that happens with the RN new-architecture fetch on some devices.
  const uploadImage = async (uri: string): Promise<string | undefined> => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_IMGBB_API;

      const result = await FileSystem.uploadAsync(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        uri,
        {
          fieldName: "image",
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        },
      );

      const data = JSON.parse(result.body);

      if (data.success) {
        return data.data.url;
      }
      console.warn(
        "[uploadImage] imgbb upload not successful:",
        data?.error?.message,
      );
      return undefined;
    } catch (error) {
      console.error("[uploadImage] Image upload error:", error);
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
      let imageUrl: string | undefined = undefined;

      if (image) {
        imageUrl = await uploadImage(image);

        if (!imageUrl) {
          Alert.alert(
            "Photo upload failed",
            "Your account will be created without a profile photo. You can add one later from Edit Profile.",
          );
        }
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

  const mutedIcon = isDark ? "#6B7280" : "#9CA3AF";
  const subtleIcon = isDark ? "#9CA3AF" : "#64748B";

  const fieldBorder = (field: "name" | "email" | "password") =>
    focusedField === field
      ? "border-emerald-500"
      : isDark
        ? "border-gray-700"
        : "border-gray-200";

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
          <View className="flex-1 px-6 pt-12 pb-8 gap-6">
            {/* Logo */}
            <View className="items-center">
              <Link href={"/"}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  className="w-32 h-12"
                  resizeMode="contain"
                />
              </Link>
            </View>

            {/* Header */}
            <View className="gap-1.5">
              <Text
                className={`text-3xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Create Account
              </Text>
              <Text
                className={`text-base ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Join the community and start thrifting
              </Text>
            </View>

            {/* Avatar picker */}
            <View className="items-center gap-2">
              <TouchableOpacity
                onPress={pickImage}
                activeOpacity={0.85}
                className="relative"
              >
                <View className="w-20 h-20 rounded-full bg-emerald-500 items-center justify-center overflow-hidden">
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Feather name="user" size={32} color="white" />
                  )}
                </View>
                <View
                  className={`absolute bottom-0 right-0 bg-emerald-500 w-7 h-7 rounded-full items-center justify-center border-2 ${
                    isDark ? "border-gray-900" : "border-white"
                  }`}
                >
                  <Feather name="camera" size={14} color="white" />
                </View>
              </TouchableOpacity>
              <Text
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Tap to add profile photo
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
                  Full Name
                </Text>
                <View
                  className={`flex-row items-center gap-2.5 ${
                    isDark ? "bg-gray-800" : "bg-gray-50"
                  } rounded-xl px-4 py-3.5 border ${fieldBorder("name")}`}
                >
                  <Feather name="user" size={18} color={mutedIcon} />
                  <TextInput
                    className={`flex-1 text-base ${isDark ? "text-white" : "text-gray-900"}`}
                    placeholder="Enter your full name"
                    placeholderTextColor={mutedIcon}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

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
                <Text
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password
                </Text>
                <View
                  className={`flex-row items-center gap-2.5 ${
                    isDark ? "bg-gray-800" : "bg-gray-50"
                  } rounded-xl px-4 py-3.5 border ${fieldBorder("password")}`}
                >
                  <Feather name="lock" size={18} color={mutedIcon} />
                  <TextInput
                    className={`flex-1 text-base ${isDark ? "text-white" : "text-gray-900"}`}
                    placeholder="Min 6 characters"
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

            {/* Submit */}
            <View className="gap-6">
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
                className="bg-emerald-500 rounded-xl py-4 items-center shadow-sm"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center items-center gap-1 mt-auto">
              <Text
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-emerald-500 font-semibold text-sm">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
