import React from "react";
import { View, Text, ImageBackground } from "react-native";

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  image: any;
}

const categories: CategoryItem[] = [
  {
    id: "1",
    name: "Books & Notes",
    subtitle: "Secondhand & New",
    image: require("../../assets/images/cat-1.png"),
  },
  {
    id: "2",
    name: "Electronics",
    subtitle: "Laptops, Phones & More",
    image: require("../../assets/images/cat-2.jpg"),
  },
  {
    id: "3",
    name: "Hostel Essentials",
    subtitle: "Everything for Your Room",
    image: require("../../assets/images/cat-3.png"),
  },
];

const CategoryCard = ({
  item,
  style,
}: {
  item: CategoryItem;
  style?: any;
}) => (
  <ImageBackground
    source={item.image}
    style={[
      {
        overflow: "hidden",
        borderRadius: 20,
        justifyContent: "flex-end",
      },
      style,
    ]}
    imageStyle={{
      borderRadius: 20,
    }}
  >
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