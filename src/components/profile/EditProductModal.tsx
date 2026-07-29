// components/profile/EditProductModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";

interface Product {
  _id: string;
  title: string;
  price: number;
  condition: string;
  description?: string;
  images?: string[];
  category?: string;
  location?: string;
}

interface EditProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  product: Product | null;
  loading?: boolean;
}

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Used"];

const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  onClose,
  onSave,
  product,
  loading = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    condition: "",
    category: "",
    location: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        price: product.price?.toString() || "",
        description: product.description || "",
        condition: product.condition || "",
        category: product.category || "",
        location: product.location || "",
      });
      setImages(product.images || []);
    }
  }, [product]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((item) => item.uri);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const filtered = images.filter((_, i) => i !== index);
    setImages(filtered);
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const uri of images) {
      if (uri.startsWith("http")) {
        uploadedUrls.push(uri);
        continue;
      }
      try {
        const uploadResult = await FileSystem.uploadAsync(
          `https://api.imgbb.com/1/upload?key=${process.env.EXPO_PUBLIC_IMGBB_API}`,
          uri,
          {
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "image",
            mimeType: "image/jpeg",
            parameters: { name: "image.jpg" },
          },
        );
        if (uploadResult.status < 200 || uploadResult.status >= 300) {
          throw new Error("Upload failed");
        }
        const data = JSON.parse(uploadResult.body);
        if (!data.success) throw new Error("Upload failed");
        uploadedUrls.push(data.data.url);
      } catch (error) {
        Alert.alert("Error", "Failed to upload image");
        throw error;
      }
    }
    return uploadedUrls;
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      Alert.alert("Error", "Valid price is required");
      return;
    }
    if (!form.condition) {
      Alert.alert("Error", "Condition is required");
      return;
    }
    if (images.length === 0) {
      Alert.alert("Error", "At least one image is required");
      return;
    }

    setUploading(true);
    try {
      const uploadedImages = await uploadImages();
      onSave({
        ...form,
        price: parseFloat(form.price),
        images: uploadedImages,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-t-3xl p-6 pb-8 max-h-[90%]`}
        >
          <View className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full self-center mb-6" />

          <View className="flex-row justify-between items-center mb-6">
            <Text
              className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Edit Product
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather
                name="x"
                size={24}
                color={isDark ? "#94A3B8" : "#64748B"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Images Section */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                Images ({images.length}/5)
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {images.map((img, index) => (
                  <View key={index} className="relative mr-3">
                    <Image
                      source={{ uri: img }}
                      className="w-20 h-20 rounded-xl"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      className="absolute -right-1 -top-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                    >
                      <Feather name="x" size={14} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 5 && (
                  <TouchableOpacity
                    onPress={pickImage}
                    className={`w-20 h-20 rounded-xl border-2 border-dashed ${isDark ? "border-gray-700" : "border-gray-300"} items-center justify-center`}
                  >
                    <Feather
                      name="plus"
                      size={24}
                      color={isDark ? "#6B7280" : "#9CA3AF"}
                    />
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            {/* Title */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                Title *
              </Text>
              <TextInput
                className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"} p-4 rounded-xl`}
                value={form.title}
                onChangeText={(text) => setForm({ ...form, title: text })}
                placeholder="Product title"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              />
            </View>

            {/* Price & Category */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}
                >
                  Price ($) *
                </Text>
                <TextInput
                  className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"} p-4 rounded-xl`}
                  value={form.price}
                  onChangeText={(text) => setForm({ ...form, price: text })}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}
                >
                  Category
                </Text>
                <TextInput
                  className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"} p-4 rounded-xl`}
                  value={form.category}
                  onChangeText={(text) => setForm({ ...form, category: text })}
                  placeholder="e.g. Fashion"
                  placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                />
              </View>
            </View>

            {/* Condition Dropdown */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                Condition *
              </Text>
              <TouchableOpacity
                onPress={() => setShowConditionDropdown(!showConditionDropdown)}
                className={`flex-row justify-between items-center ${isDark ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-xl`}
              >
                <Text
                  className={
                    form.condition
                      ? isDark
                        ? "text-white"
                        : "text-gray-900"
                      : isDark
                        ? "text-gray-500"
                        : "text-gray-400"
                  }
                >
                  {form.condition || "Select condition"}
                </Text>
                <Feather
                  name={showConditionDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={isDark ? "#6B7280" : "#9CA3AF"}
                />
              </TouchableOpacity>

              {showConditionDropdown && (
                <View
                  className={`mt-1 rounded-xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
                >
                  {CONDITIONS.map((cond) => (
                    <TouchableOpacity
                      key={cond}
                      onPress={() => {
                        setForm({ ...form, condition: cond });
                        setShowConditionDropdown(false);
                      }}
                      className={`p-3 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <Text
                        className={
                          form.condition === cond
                            ? "text-emerald-500 font-semibold"
                            : isDark
                              ? "text-white"
                              : "text-gray-900"
                        }
                      >
                        {cond}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Location */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                Location
              </Text>
              <TextInput
                className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"} p-4 rounded-xl`}
                value={form.location}
                onChangeText={(text) => setForm({ ...form, location: text })}
                placeholder="City, State"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text
                className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                Description
              </Text>
              <TextInput
                className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"} p-4 rounded-xl`}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                multiline
                numberOfLines={4}
                placeholder="Describe your product..."
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                textAlignVertical="top"
                style={{ minHeight: 100 }}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3 mt-4">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-4 rounded-xl bg-gray-200 dark:bg-gray-700"
              >
                <Text
                  className={`text-center font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={uploading || loading}
                className="flex-1 py-4 rounded-xl bg-emerald-500"
              >
                {uploading || loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Update
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditProductModal;
