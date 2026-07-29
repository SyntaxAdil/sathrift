// components/image-picker-box.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const MAX_IMAGES = 5;

interface Props {
  onImagesChange?: (images: string[]) => void;
}

const ImagePickerBox = ({ onImagesChange }: Props) => {
  const [images, setImages] = useState<string[]>([]);

  const updateImages = (newImages: string[]) => {
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const pickImages = async () => {
    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map((item) => item.uri);

      updateImages([...images, ...selected]);
    }
  };

  const removeImage = (index: number) => {
    const filtered = images.filter((_, i) => i !== index);

    updateImages(filtered);
  };

  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xs text-gray-400">
          {images.length}/{MAX_IMAGES}
        </Text>
      </View>

      {images.length === 0 ? (
        <Pressable
          onPress={pickImages}
          className="h-32 rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 items-center justify-center"
        >
          <Ionicons name="cloud-upload-outline" size={28} color="#64748b" />

          <Text className="mt-2 text-gray-700 dark:text-gray-300 font-semibold text-sm">
            Upload photo
          </Text>
        </Pressable>
      ) : (
        <View>
          <Image
            source={{
              uri: images[0],
            }}
            className="w-full h-40 rounded-2xl"
          />

          <ScrollView horizontal className="mt-3">
            {images.slice(1).map((img, index) => (
              <View key={img} className="mr-3 relative">
                <Image
                  source={{
                    uri: img,
                  }}
                  className="w-20 h-20 rounded-xl"
                />

                <Pressable
                  onPress={() => removeImage(index + 1)}
                  className="absolute -right-1 -top-1 w-6 h-6 rounded-full bg-black items-center justify-center"
                >
                  <Ionicons name="close" size={15} color="white" />
                </Pressable>
              </View>
            ))}

            {images.length < MAX_IMAGES && (
              <Pressable
                onPress={pickImages}
                className="w-20 h-20 rounded-xl border border-dashed border-gray-300 items-center justify-center"
              >
                <Ionicons name="add" size={28} color="#64748b" />
              </Pressable>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ImagePickerBox;