// app/(tabs)/sell/index.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";
import { useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ImagePickerBox from "../../components/image-picker-box";
import { authClient } from "../../lib/auth-client";
import type { Product } from "../../types/product.type";
import Header from "../../components/header";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Books",
  "Home",
  "Sports",
  "Vehicles",
  "Accessories",
  "Other",
];

const CONDITIONS: { label: string; value: Product["condition"] }[] = [
  { label: "New", value: "New" },
  { label: "Like New", value: "Like New" },
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" },
  { label: "Used", value: "Used" },
];

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

const SellScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { data: session } = authClient.useSession();

  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<Product["condition"]>("New");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categoryFieldRef = useRef<View>(null);
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0, width: 0 });

  const openCategoryDropdown = () => {
    categoryFieldRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPos({ x, y: y + height + 6, width });
      setCategoryModalOpen(true);
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    return Promise.all(
      images.map(async (uri) => {
        const uploadResult = await FileSystem.uploadAsync(
          `https://api.imgbb.com/1/upload?key=${process.env.EXPO_PUBLIC_IMGBB_API}`,
          uri,
          {
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "image",
            mimeType: "image/jpeg",
            parameters: {
              name: "image.jpg",
            },
          }
        );

        if (uploadResult.status < 200 || uploadResult.status >= 300) {
          throw new Error("Image upload failed");
        }

        const data = JSON.parse(uploadResult.body);
        if (!data.success) throw new Error("Image upload failed");
        return data.data.url as string;
      })
    );
  };

  const validate = () => {
    if (images.length === 0) return "Add at least one photo";
    if (!title.trim()) return "Product title is required";
    if (!category) return "Select a category";
    if (!description.trim()) return "Description is required";
    if (!price || Number(price) <= 0) return "Enter a valid price";
    if (!location.trim()) return "Location is required";
    return null;
  };

  const handlePublish = async () => {
    const error = validate();
    if (error) return Alert.alert("Missing info", error);

    setSubmitting(true);
    try {
      const uploadedUrls = await uploadImages();

      const payload: Partial<Product> = {
        title,
        description,
        price: Number(price),
        category,
        condition,
        images: uploadedUrls,
        location,
        sellerId: session?.user?.id,
        sellerName: session?.user?.name,
        sellerImage: session?.user?.image ?? undefined,
      };

      const res = await fetch(`${API_URL}/api/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!result.success) throw new Error(result.message);

      Alert.alert("Success", "Item published successfully!");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Publish failed", err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    return (
      <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <Header/>
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="cloud-upload-outline" size={64} color="#94A3B8" />
          <Text className={`text-lg font-semibold mt-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Sign In Required
          </Text>
          <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1 text-center`}>
            Please sign in to sell your items
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="mt-6 bg-emerald-500 px-8 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 pt-4 pb-10">
          <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            List Your Item
          </Text>
          <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
            Give your pre-loved items a second life
          </Text>

          <View className="mt-6">
            <Text className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider mb-2`}>
              Photos
            </Text>
            <ImagePickerBox onImagesChange={setImages} />
          </View>

          <View className="mt-5">
            <Text className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider mb-2`}>
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What are you selling?"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"} p-4 rounded-2xl shadow-sm`}
            />
          </View>

          <View className="mt-5">
            <Text className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider mb-2`}>
              Category
            </Text>
            <View ref={categoryFieldRef} collapsable={false}>
              <Pressable
                onPress={openCategoryDropdown}
                className={`flex-row justify-between items-center ${isDark ? "bg-gray-800" : "bg-white"} p-4 rounded-2xl shadow-sm`}
              >
                <Text className={category ? (isDark ? "text-white" : "text-gray-900") : isDark ? "text-gray-500" : "text-gray-400"}>
                  {category || "Select Category"}
                </Text>
                <Ionicons
                  name={categoryModalOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={isDark ? "#9CA3AF" : "#94A3B8"}
                />
              </Pressable>
            </View>
          </View>

          <Modal
            visible={categoryModalOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setCategoryModalOpen(false)}
          >
            <Pressable
              className="flex-1"
              onPress={() => setCategoryModalOpen(false)}
            >
              <View
                style={{
                  position: "absolute",
                  top: dropdownPos.y,
                  left: dropdownPos.x,
                  width: dropdownPos.width,
                  maxHeight: 280,
                }}
                className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl overflow-hidden border ${isDark ? "border-gray-700" : "border-gray-100"}`}
              >
                <ScrollView bounces={false}>
                  {CATEGORIES.map((c) => {
                    const active = c === category;
                    return (
                      <Pressable
                        key={c}
                        onPress={() => {
                          setCategory(c);
                          setCategoryModalOpen(false);
                        }}
                        className={`px-4 py-3.5 ${active ? (isDark ? "bg-gray-700" : "bg-gray-50") : ""}`}
                      >
                        <Text
                          className={
                            active
                              ? "text-emerald-500 font-semibold"
                              : isDark ? "text-white" : "text-gray-900"
                          }
                        >
                          {c}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </Pressable>
          </Modal>

          <View className="mt-5">
            <Text className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider mb-2`}>
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your item in detail..."
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"} p-4 rounded-2xl shadow-sm`}
              style={{ minHeight: 120 }}
            />
          </View>

          <View className="mt-5">
            <Text className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider mb-2`}>
              Condition
            </Text>
            <View className={`flex-row ${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-1.5 shadow-sm`}>
              {CONDITIONS.map((c) => {
                const active = condition === c.value;
                return (
                  <Pressable
                    key={c.value}
                    onPress={() => setCondition(c.value)}
                    className={`flex-1 py-2.5 rounded-xl items-center ${active ? (isDark ? "bg-gray-700" : "bg-gray-100") : ""}`}
                  >
                    <Text
                      className={
                        active
                          ? "text-emerald-500 font-semibold"
                          : isDark ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="flex-row gap-4 mt-5">
            <View className="flex-1">
              <Text className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider mb-2`}>
                Price ($)
              </Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                keyboardType="decimal-pad"
                className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"} p-4 rounded-2xl shadow-sm`}
              />
            </View>
            <View className="flex-1">
              <Text className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider mb-2`}>
                Location
              </Text>
              <View className={`flex-row items-center ${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm`}>
                <Ionicons name="location-outline" size={20} color={isDark ? "#6B7280" : "#9CA3AF"} style={{ marginLeft: 14 }} />
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, State"
                  placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                  className={`flex-1 ${isDark ? "text-white" : "text-gray-900"} p-4`}
                />
              </View>
            </View>
          </View>

          <Pressable
            onPress={handlePublish}
            disabled={submitting}
            className="mt-8 bg-emerald-500 rounded-2xl py-4 items-center "
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Publish Item</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SellScreen;