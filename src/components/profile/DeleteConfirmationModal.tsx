// components/profile/DeleteConfirmationModal.tsx
import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <View className={`${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm`}>
          <View className="items-center">
            <View className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mb-4">
              <Feather name="alert-triangle" size={32} color="#EF4444" />
            </View>
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
              Delete Product?
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center mt-2`}>
              This action cannot be undone
            </Text>
          </View>
          <View className="flex-row space-x-3 mt-6">
            <TouchableOpacity 
              onPress={onClose} 
              className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700"
            >
              <Text className={`text-center font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onConfirm} 
              className="flex-1 py-3 rounded-xl bg-red-500"
            >
              <Text className="text-white text-center font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;