// HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import useAuth from '../components/Header/Header';
import { styles } from './HomeScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  description: string;
  category_name: string;
  condition_display: string;
}

interface CartItem {
  id: number;
  quantity: number;
}

interface CartResponse {
  items: CartItem[];
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { token: authToken } = useAuth();
  const insets = useSafeAreaInsets(); // ← Lấy insets để xử lý safe area

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestProducts();
    fetchCartItemCount();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCartItemCount();
    }, [authToken])
  );

  const fetchLatestProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://bkapp-mp8l.onrender.com/products?search=');
      if (!response.ok) throw new Error('Không thể tải sản phẩm');

      const data = await response.json();
      const productList: Product[] = data.results || data || [];

      const latestProducts = productList
        .sort((a: Product, b: Product) => b.id - a.id)
        .slice(0, 4);

      setProducts(latestProducts);
    } catch (error) {
      console.error('Lỗi fetch sản phẩm:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItemCount = async () => {
    if (!authToken) {
      setCartItemCount(0);
      return;
    }

    try {
      const response = await fetch('https://bkapp-mp8l.onrender.com/cart', {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });

      if (response.ok) {
        const data: CartResponse = await response.json();
        const count = data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(count);
        console.log('Số lượng giỏ hàng:', count);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error('Lỗi fetch số lượng giỏ hàng:', error);
      setCartItemCount(0);
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const fakeSold = Math.floor(Math.random() * 40) + 10;
    const fakeMaxSold = 50;
    const soldPercent = Math.min(1, fakeSold / fakeMaxSold);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => handleProductPress(item)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.1)']}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.soldText}>
            {fakeSold} đã bán
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#4D5BFF', '#8FA8FF']}
                style={[styles.progressFill, { width: `${soldPercent * 100}%` }]}
              />
            </View>
          </View>

          <Text style={styles.priceText}>
            {parseInt(item.price).toLocaleString('vi-VN')} ₫
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const Banner = () => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Search')}
      style={styles.bannerContainer}
    >
      <LinearGradient colors={['#6C8CFF', '#8FB1FF']} style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>NEW YEAR, NEW ME</Text>
          <Text style={styles.bannerSubtitle}>BEST DEALS UP TO 80% OFF</Text>
          <Text style={styles.bannerCallToAction}>Mua ngay thôi nào! →</Text>
        </View>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2086/2086578.png' }}
          style={styles.bannerImage}
        />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Header với badge giỏ hàng */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('SideBar')}>
          <Image source={require('../assets/ic_menu.png')} style={styles.menuIcon} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image
            source={require('../assets/ic_user.png')}
            style={styles.avatar}
          />
          <Text style={styles.greetingText}>Chào, Tester!</Text>
        </View>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Image source={require('../assets/ic_bag.png')} style={styles.cartIcon} />
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4D5BFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Chưa có sản phẩm nào</Text>
          <Text style={styles.emptySubtitle}>Hãy quay lại sau nhé!</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: insets.bottom + 100 } // Buffer để floating button không che
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={Banner}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Search')}
        activeOpacity={0.8}
      >
        <LinearGradient colors={['#4D5BFF', '#8FA8FF']} style={styles.floatingGradient}>
          <Image source={require('../assets/ic_search.png')} style={styles.searchIcon} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}