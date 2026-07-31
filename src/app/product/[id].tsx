// app/product/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  FlatList,
  Dimensions,
  Alert,
  Linking,
  Share,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useColorScheme } from "react-native";
import { authClient } from "../../lib/auth-client";
import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "../../components/LoadingScreen";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { data: session } = authClient.useSession();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product && session?.user?.id) {
      checkWishlistStatus();
    }
  }, [product, session]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/wishlist?userId=${session?.user?.id}`,
      );
      if (response.data.success) {
        const wishlisted = response.data.data.some(
          (item: any) => item.productId === id || item.product?._id === id,
        );
        setIsWishlisted(wishlisted);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!session?.user?.id) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to add items to wishlist",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push("/(auth)/login") },
        ],
      );
      return;
    }

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await axios.delete(`${API_URL}/api/wishlist/${id}`, {
          data: { userId: session.user.id },
        });
        setIsWishlisted(false);
        Alert.alert("Removed", "Product removed from wishlist");
      } else {
        await axios.post(`${API_URL}/api/wishlist/${id}`, {
          userId: session.user.id,
        });
        setIsWishlisted(true);
        Alert.alert("Added", "Product added to wishlist");
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        Alert.alert(
          "Already Added",
          "This product is already in your wishlist",
        );
      } else {
        Alert.alert("Error", "Failed to update wishlist");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Check out this product: ${product.title}\nPrice: $${product.price?.toFixed(2)}\nLocation: ${product.location || 'Location not specified'}\n\nView details: ${API_URL}/product/${id}`;
      
      const result = await Share.share({
        message: shareMessage,
        title: product.title,
        url: `${API_URL}/product/${id}`, // For iOS
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log('Shared with activity type:', result.activityType);
        } else {
          // Shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to share product');
    }
  };

  const handleWhatsApp = () => {
    const phone = product?.sellerWhatsapp || "";
    if (!phone) {
      Alert.alert("No WhatsApp", "Seller has not provided a WhatsApp number");
      return;
    }
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open WhatsApp");
    });
  };

  const onScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveImageIndex(slideIndex);
  };

  if (loading) {
    return <LoadingScreen message="Loading product details..." />;
  }

  if (!product) {
    return (
      <View
        className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"} items-center justify-center p-6`}
      >
        <Feather name="alert-circle" size={48} color="#94A3B8" />
        <Text
          className={`${isDark ? "text-gray-400" : "text-gray-500"} mt-3 text-center`}
        >
          Product not found
        </Text>
        <TouchableOpacity
          className="mt-4 bg-emerald-500 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = product.images || ["https://via.placeholder.com/400"];

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View
            className={`relative ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item || "https://via.placeholder.com/400" }}
                  className="w-full"
                  style={{ height: 400, width: width }}
                  resizeMode="cover"
                />
              )}
            />

            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]}
              locations={[0, 0.3, 1]}
              className="absolute inset-0"
            />

            <TouchableOpacity
              className="absolute top-12 left-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full items-center justify-center shadow-lg"
              onPress={() => router.back()}
            >
              <Feather
                name="arrow-left"
                size={22}
                color={isDark ? "#FFFFFF" : "#1F2937"}
              />
            </TouchableOpacity>

            <View className="absolute top-12 right-4 flex-row gap-3">
              <TouchableOpacity
                onPress={handleWishlistToggle}
                disabled={wishlistLoading}
                className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full items-center justify-center shadow-lg"
              >
                {wishlistLoading ? (
                  <ActivityIndicator size="small" color="#22C55E" />
                ) : (
                  <Feather
                    name="heart"
                    size={20}
                    color={
                      isWishlisted ? "#EF4444" : isDark ? "#FFFFFF" : "#1F2937"
                    }
                    fill={isWishlisted ? "#EF4444" : "transparent"}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleShare}
                className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full items-center justify-center shadow-lg"
              >
                <Feather
                  name="share-2"
                  size={20}
                  color={isDark ? "#FFFFFF" : "#1F2937"}
                />
              </TouchableOpacity>
            </View>

            {images.length > 1 && (
              <View className="absolute bottom-20 left-0 right-0 flex-row justify-center">
                {images.map((_: any, index: number) => (
                  <View
                    key={index}
                    className={`h-1.5 rounded-full mx-1 ${activeImageIndex === index ? "w-6 bg-emerald-500" : "w-1.5 bg-white/50"}`}
                  />
                ))}
              </View>
            )}

            <View className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <Text className="text-white font-semibold text-sm tracking-wide">
                {product.condition?.toUpperCase() || "AVAILABLE"}
              </Text>
            </View>

            {product.status === "sold" && (
              <View className="absolute inset-0 bg-black/50 items-center justify-center">
                <View className="bg-red-500 px-6 py-2 rounded-full transform -rotate-12">
                  <Text className="text-white font-bold text-xl tracking-wider">
                    SOLD
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="px-5 pt-6 pb-8">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text
                  className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {product.title}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Feather name="map-pin" size={16} color="#94A3B8" />
                  <Text
                    className={`text-sm ml-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {product.location || "Location not specified"}
                  </Text>
                </View>
              </View>
              <Text className="text-3xl font-bold text-emerald-500">
                BDT {product.price?.toFixed(2)}
              </Text>
            </View>

            <View
              className={`h-px ${isDark ? "bg-gray-800" : "bg-gray-200"} my-5`}
            />

            <Text
              className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"} mb-3`}
            >
              Description
            </Text>
            <Text
              className={`leading-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              {product.description || "No description available"}
            </Text>

            <View
              className={`h-px ${isDark ? "bg-gray-800" : "bg-gray-200"} my-5`}
            />

            <Text
              className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"} mb-4`}
            >
              Seller
            </Text>
            <View
              className={`flex-row items-center ${isDark ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-2xl`}
            >
              {product.sellerImage ? (
                <Image
                  source={{ uri: product.sellerImage }}
                  className="w-14 h-14 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center">
                  <Text className="text-emerald-500 dark:text-emerald-400 font-bold text-xl">
                    {product.sellerName?.charAt(0)?.toUpperCase() || "S"}
                  </Text>
                </View>
              )}
              <View className="ml-4 flex-1">
                <Text
                  className={`font-semibold text-base ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {product.sellerName || "Unknown Seller"}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Feather name="phone" size={14} color="#94A3B8" />
                  <Text
                    className={`text-sm ml-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {product.sellerWhatsapp || "No WhatsApp"}
                  </Text>
                </View>
              </View>
            </View>

            {product.status !== "sold" ? (
              <TouchableOpacity
                onPress={handleWhatsApp}
                className="mt-8 bg-emerald-500 py-4 rounded-2xl active:opacity-80  flex-row items-center justify-center"
              >
                <Feather name="message-circle" size={20} color="white" />
                <Text className="text-white text-center font-bold text-base ml-2">
                  Contact on WhatsApp
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="mt-8 bg-gray-400 py-4 rounded-2xl items-center opacity-70">
                <Text className="text-white font-bold text-base">
                  Item Sold
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}