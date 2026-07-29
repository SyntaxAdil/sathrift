// app/(tabs)/explore/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import axios from "axios";
import ProductCard from "../../components/product-card";
import Header from "../../components/header";
import EmptyState from "../../components/empty-state";
import { Product } from "../../types/product.type";

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

type SortOption = "latest" | "price-low" | "price-high" | "popular";

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as string);
    }
    if (params.search) {
      setSearchQuery(params.search as string);
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product`);
      if (response.data.success) {
        setProducts(response.data.data);
        applyFilters(response.data.data, searchQuery, selectedCategory, sortBy);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = (
    allProducts: Product[],
    query: string,
    category: string,
    sort: SortOption
  ) => {
    let filtered = [...allProducts];

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "latest":
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilters(products, text, selectedCategory, sortBy);
  };

  const handleCategorySelect = (category: string) => {
    const newCategory = category === selectedCategory ? "" : category;
    setSelectedCategory(newCategory);
    applyFilters(products, searchQuery, newCategory, sortBy);
  };

  const handleSort = (sort: SortOption) => {
    setSortBy(sort);
    setShowSortDropdown(false);
    applyFilters(products, searchQuery, selectedCategory, sort);
  };

  const handleProductPress = (id: string) => {
    router.push({
      pathname: "/product/[id]",
      params: { id },
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View className="w-[47%] mb-5">
      <ProductCard
        id={item._id as string}
        title={item.title}
        price={item.price}
        condition={item.condition}
        images={item.images}
        location={item.location}
        status={item.status}
        onPress={() => handleProductPress(item._id as string)}
      />
    </View>
  );

  if (loading) {
    return (
      <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"} items-center justify-center`}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <Header />

      <View className="px-5 pt-5 pb-3">
        <Text className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Search
        </Text>
        <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
          {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} found
        </Text>
      </View>

      <View className="px-5 pb-4 mt-2">
        <View
          className={`flex-row items-center ${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl px-4 border ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <Feather name="search" size={20} color={isDark ? "#6B7280" : "#9CA3AF"} />
          <TextInput
            className={`flex-1 py-3.5 ml-2 ${isDark ? "text-white" : "text-gray-900"}`}
            placeholder="Search products..."
            placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Feather name="x" size={18} color={isDark ? "#6B7280" : "#9CA3AF"} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="px-5 pb-3 mt-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => handleCategorySelect("")}
            className={`px-4 py-2 rounded-full mr-2.5 ${!selectedCategory ? "bg-emerald-500" : isDark ? "bg-gray-800" : "bg-gray-200"}`}
          >
            <Text className={!selectedCategory ? "text-white" : isDark ? "text-white" : "text-gray-700"}>
              All
            </Text>
          </TouchableOpacity>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-full mr-2.5 ${selectedCategory === cat ? "bg-emerald-500" : isDark ? "bg-gray-800" : "bg-gray-200"}`}
            >
              <Text className={selectedCategory === cat ? "text-white" : isDark ? "text-white" : "text-gray-700"}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="flex-row items-center justify-between px-5 py-3 my-4">
        <View className="flex-row items-center">
          <Feather name="filter" size={16} color={isDark ? "#9CA3AF" : "#64748B"} />
          <Text className={`text-sm ml-2.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {selectedCategory || "All Categories"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowSortDropdown(!showSortDropdown)}
          className="flex-row items-center"
        >
          <Feather name="arrow-down" size={16} color={isDark ? "#9CA3AF" : "#64748B"} />
          <Text className={`text-sm ml-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {sortBy === "latest" && "Latest"}
            {sortBy === "price-low" && "Price: Low-High"}
            {sortBy === "price-high" && "Price: High-Low"}
            {sortBy === "popular" && "Popular"}
          </Text>
          <Feather name="chevron-down" size={16} color={isDark ? "#9CA3AF" : "#64748B"} />
        </TouchableOpacity>
      </View>

      {showSortDropdown && (
        <View className={`mx-5 mt-2 rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"} overflow-hidden`}>
          {[
            { label: "Latest", value: "latest" },
            { label: "Price: Low to High", value: "price-low" },
            { label: "Price: High to Low", value: "price-high" },
            { label: "Most Popular", value: "popular" },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => handleSort(item.value as SortOption)}
              className={`px-4 py-3.5 ${sortBy === item.value ? (isDark ? "bg-gray-700" : "bg-gray-100") : ""}`}
            >
              <Text className={sortBy === item.value ? "text-emerald-500 font-medium" : isDark ? "text-white" : "text-gray-900"}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {filteredProducts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <EmptyState
            icon="search"
            title="No products found"
            description="Try adjusting your search or filters"
          />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id as string}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#22C55E"]} />
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}