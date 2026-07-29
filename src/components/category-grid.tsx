// components/category-grid.tsx
import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}

const categories: CategoryItem[] = [
  {
    id: "1",
    name: "Books & Notes",
    subtitle: "Secondhand & New",
    image: "https://loremflickr.com/500/600/textbook?lock=101",
  },
  {
    id: "2",
    name: "Electronics",
    subtitle: "Laptops, Phones & More",
    image: "https://loremflickr.com/500/600/laptop?lock=102",
  },
  {
    id: "3",
    name: "Hostel Essentials",
    subtitle: "Everything for Your Room",
    image: "https://loremflickr.com/1000/450/dormroom?lock=103",
  },
];

const CategoryCard = ({ item, style }: { item: CategoryItem; style?: any }) => (
  <ImageBackground
    source={{ uri: item.image }}
    style={[
      {
        overflow: "hidden",
        borderRadius: 20,
        justifyContent: "flex-end",
      },
      style,
    ]}
    imageStyle={{ borderRadius: 20 }}
  >
    <LinearGradient
      colors={["transparent", "rgba(0,0,0,0.85)"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
      }}
    />

    <View
      style={{
        padding: 14,
        zIndex: 1,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: "700",
        }}
      >
        {item.name}
      </Text>

      <Text
        style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: 12,
          marginTop: 2,
        }}
      >
        {item.subtitle}
      </Text>
    </View>
  </ImageBackground>
);

const CategoryGrid: React.FC = () => {
  return (
    <View className="mb-6 px-4">
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Explore Categories
      </Text>

      <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        <CategoryCard item={categories[0]} style={{ flex: 1, height: 150 }} />
        <CategoryCard item={categories[1]} style={{ flex: 1, height: 150 }} />
      </View>

      <CategoryCard
        item={categories[2]}
        style={{ width: "100%", height: 130 }}
      />
    </View>
  );
};

export default CategoryGrid;
