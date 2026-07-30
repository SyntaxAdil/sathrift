// components/profile/EditProfileModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system/legacy";
interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, image: string, university: string, phoneNumber: string) => void;
  initialName: string;
  initialEmail: string;
  initialImage?: string;
  initialUniversity?: string;
  initialPhoneNumber?: string;
  loading: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  initialName,
  initialEmail,
  initialImage,
  initialUniversity = '',
  initialPhoneNumber = '',
  loading
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage || ''); // may hold a local uri (unsaved) or a hosted url
  const [university, setUniversity] = useState(initialUniversity);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      // just preview locally for now — NOT saved to DB yet
      setImage(result.assets[0].uri);
    }
  };

  // Uses FileSystem.uploadAsync instead of fetch+FormData —
  // avoids the "Unsupported FormDataPart implementation" crash.
  const uploadImage = async (uri: string): Promise<string | undefined> => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_IMGBB_API;

      const result = await FileSystem.uploadAsync(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        uri,
        {
          fieldName: 'image',
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        }
      );

      const data = JSON.parse(result.body);

      if (data.success) {
        return data.data.url;
      }
      console.warn('[uploadImage] imgbb upload not successful:', data?.error?.message);
      return undefined;
    } catch (error) {
      console.error('[uploadImage] Image upload error:', error);
      return undefined;
    }
  };

  const handleSave = async () => {
    let finalImage = image;

    // If image is a local file uri (newly picked), upload it first.
    // Anything already starting with http(s) is an existing hosted image — no need to re-upload.
    const isLocalUri = image && !image.startsWith('http');

    if (isLocalUri) {
      setUploading(true);
      const uploadedUrl = await uploadImage(image);
      setUploading(false);

      if (!uploadedUrl) {
        Alert.alert('Upload Failed', 'Could not upload your photo. Please try again.');
        return;
      }
      finalImage = uploadedUrl;
      setImage(uploadedUrl);
    }

    onSave(name, finalImage, university, phoneNumber);
  };

  const isBusy = loading || uploading;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl p-6 pb-8`}>
          <View className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full self-center mb-6" />
          
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit Profile
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="items-center mb-6">
              <TouchableOpacity onPress={pickImage} className="relative" disabled={uploading}>
                <View className="w-24 h-24 rounded-full bg-emerald-500 items-center justify-center overflow-hidden shadow-lg">
                  {image ? (
                    <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <Text className="text-white text-3xl font-bold">
                      {name?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                  )}
                  {uploading && (
                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                      <ActivityIndicator size="small" color="white" />
                    </View>
                  )}
                </View>
                <View className="absolute bottom-0 right-0 bg-emerald-500 w-8 h-8 rounded-full items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
                  <Feather name="camera" size={16} color="white" />
                </View>
              </TouchableOpacity>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                {uploading ? 'Uploading photo...' : 'Tap to change photo'}
              </Text>
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Display Name
              </Text>
              <TextInput
                className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} p-4 rounded-xl`}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                WhatsApp Number
              </Text>
              <TextInput
                className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} p-4 rounded-xl`}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+880 1XXX-XXXXXX"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="phone-pad"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                University / College
              </Text>
              <TextInput
                className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} p-4 rounded-xl`}
                value={university}
                onChangeText={setUniversity}
                placeholder="Enter your university or college name"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </View>

            <View className="mb-6">
              <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Email Address
              </Text>
              <View className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-xl opacity-70`}>
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {initialEmail}
                </Text>
              </View>
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                Email cannot be changed
              </Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity 
                onPress={onClose} 
                disabled={isBusy}
                className="flex-1 py-4 rounded-xl bg-gray-200 dark:bg-gray-700"
              >
                <Text className={`text-center font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSave} 
                disabled={isBusy}
                className="flex-1 py-4 rounded-xl bg-emerald-500"
              >
                {isBusy ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold">Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileModal;