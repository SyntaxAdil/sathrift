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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";
import ImagePickerBox from "../../components/image-picker-box";
import { authClient } from "../../lib/auth-client";
import type { Product } from "../../types/product.type";

const CATEGORIES = [
  "Clothing",
  "Bags",
  "Shoes",
  "Watches",
  "Jewelry",
  "Accessories",
  "Home",
  "Other",
];

const CONDITIONS: { label: string; value: Product["condition"] }[] = [
  { label: "New", value: "New" },
  { label: "Mint", value: "Like New" },
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" },
];

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

const inputBase = {
  paddingHorizontal: 16,
  paddingVertical: 12,
};

const SellScreen = () => {
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
          },
        );

        if (uploadResult.status < 200 || uploadResult.status >= 300) {
          throw new Error("Image upload failed");
        }

        const data = JSON.parse(uploadResult.body);
        if (!data.success) throw new Error("Image upload failed");
        return data.data.url as string;
      }),
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

      Alert.alert("Success", "Item published!");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Publish failed", err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-neutral-950">
      <View className="mt-16 mx-6 pb-10">
        <Text className="text-2xl font-bold text-black dark:text-white">
          Sell your item
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">
          Post your luxury or sustainable pre-loved goods to the community.
        </Text>

        <Text className="mt-6 text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wide">
          ITEM PHOTOGRAPHY
        </Text>
        <ImagePickerBox onImagesChange={setImages} />

        <Field label="PRODUCT TITLE">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Vintage 90s Wool Trench Coat"
            placeholderTextColor="#94a3b8"
            style={inputBase}
            className="bg-slate-100 dark:bg-neutral-900 text-black dark:text-white rounded-xl"
          />
        </Field>

        <Field label="CATEGORY">
          <View ref={categoryFieldRef} collapsable={false}>
            <Pressable
              onPress={openCategoryDropdown}
              style={inputBase}
              className="flex-row justify-between items-center bg-slate-100 dark:bg-neutral-900 rounded-xl"
            >
              <Text
                className={
                  category ? "text-black dark:text-white" : "text-gray-400"
                }
              >
                {category || "Select Category"}
              </Text>
              <Ionicons
                name={categoryModalOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color="#94a3b8"
              />
            </Pressable>
          </View>
        </Field>

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
              className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-lg overflow-hidden"
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
                      className={`px-4 py-3 border-b border-gray-100 dark:border-neutral-800 ${
                        active ? "bg-slate-50 dark:bg-neutral-800" : ""
                      }`}
                    >
                      <Text
                        className={
                          active
                            ? "text-green-600 font-semibold"
                            : "text-black dark:text-white"
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

        <Field label="DESCRIPTION">
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us about the history, material, and fit of your item..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[inputBase, { height: 96 }]}
            className="bg-slate-100 dark:bg-neutral-900 text-black dark:text-white rounded-xl"
          />
        </Field>

        <Field label="CONDITION">
          <View className="flex-row bg-slate-100 dark:bg-neutral-900 rounded-xl p-1">
            {CONDITIONS.map((c) => {
              const active = condition === c.value;
              return (
                <Pressable
                  key={c.value}
                  onPress={() => setCondition(c.value)}
                  className={`flex-1 py-2 rounded-lg items-center ${
                    active ? "bg-white dark:bg-neutral-800" : ""
                  }`}
                >
                  <Text
                    className={
                      active
                        ? "text-green-600 font-semibold"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Field>

        <View className="flex-row mt-5 gap-4">
          <View className="flex-1">
            <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wide mb-2">
              PRICE ($)
            </Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              style={inputBase}
              className="bg-slate-100 dark:bg-neutral-900 text-black dark:text-white rounded-xl"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wide mb-2">
              LOCATION
            </Text>
            <View
              style={{ paddingHorizontal: 16 }}
              className="flex-row items-center bg-slate-100 dark:bg-neutral-900 rounded-xl"
            >
              <Ionicons name="location-outline" size={16} color="#94a3b8" />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="City, State"
                placeholderTextColor="#94a3b8"
                style={{ paddingVertical: 12, marginLeft: 8 }}
                className="flex-1 text-black dark:text-white"
              />
            </View>
          </View>
        </View>

        <Pressable
          onPress={handlePublish}
          disabled={submitting}
          className="mt-8 bg-green-500 rounded-xl py-4 items-center"
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Publish Item</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <View className="mt-5">
    <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wide mb-2">
      {label}
    </Text>
    {children}
  </View>
);

export default SellScreen;
