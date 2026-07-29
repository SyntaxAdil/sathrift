// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useColorScheme } from 'react-native';
import Header from '../../components/header';
import HeroSlider from '../../components/hero-slider';
import CategoryGrid from '../../components/category-grid';
import SectionHeader from '../../components/section-header';
import ProductGrid from '../../components/product-grid';

import StudentPicks from '../../components/student-picks';
import ExploreMore from '../../components/explore-more';
import EmptyState from '../../components/empty-state';
import RecommendedSection from '../../components/recomended-section';

interface Product {
  _id: string;
  title: string;
  price: number;
  condition: string;
  images: string[];
  location: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/product`);
      if (response.data.success) {
        const all = response.data.data;
        setProducts(all);
        setFeatured(all.slice(0, 4));
        setRecent(all.slice(4, 10));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleProductPress = (id: string) => {
    router.push({
      pathname: '/product/[id]',
      params: { id }
    });
  };

  const handleWishlistPress = (id: string) => {
    console.log('Wishlist:', id);
  };

  const handleCategoryPress = (category: string) => {
    router.push(`/explore?category=${category}` as any);
  };

  if (loading) {
    return (
      <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} items-center justify-center`}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View>
            <HeroSlider products={featured} />
            
            <CategoryGrid onCategoryPress={handleCategoryPress} />
            
            {featured.length > 0 && (
              <>
                <SectionHeader 
                  title="Featured" 
                  onSeeAll={() => router.push('/explore' as any)}
                />
                <ProductGrid 
                  products={featured} 
                  onProductPress={handleProductPress}
                  onWishlistPress={handleWishlistPress}
                />
              </>
            )}

            {recent.length > 0 && (
              <RecommendedSection 
                products={recent}
                onProductPress={handleProductPress}
                onWishlistPress={handleWishlistPress}
              />
            )}

            {products.length > 6 && (
              <StudentPicks 
                products={products.slice(6, 12)}
                onProductPress={handleProductPress}
                onWishlistPress={handleWishlistPress}
              />
            )}

            <ExploreMore 
              title="Discover More"
              subtitle="Find amazing deals from fellow students"
            />

            {products.length === 0 && (
              <EmptyState 
                title="No Products Found" 
                description="Be the first to list an item!" 
              />
            )}
            
            <View className="h-4" />
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22C55E']} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}