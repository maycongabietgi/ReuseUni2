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

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { token: authToken } = useAuth();
  const insets = useSafeAreaInsets();

  const [products, setProducts] = useState<any[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Bạn');

  // Lấy thông tin người dùng để hiển thị tên
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) return;
      try {
        const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
          headers: { 'Authorization': `Token ${authToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          // Ưu tiên lấy name, nếu không có lấy username
          setUserName(data.name || data.username || 'Bạn');
        }
      } catch (err) {
        console.error('Lỗi lấy profile:', err);
      }
    };
    fetchProfile();
  }, [authToken]);

  // Hàm xử lý URL ảnh (Fix lỗi không hiện ảnh sản phẩm)
  const fixHttpToHttps = (url: string | null | undefined): string => {
    if (!url) return 'https://via.placeholder.com/150';
    const BASE_URL = 'https://bkapp-mp8l.onrender.com';
    let cleanUrl = url.trim();

    if (cleanUrl.startsWith('/')) {
      return `${BASE_URL}${cleanUrl}`;
    }
    if (cleanUrl.startsWith('http://')) {
      return cleanUrl.replace(/^http:/i, 'https:');
    }
    return cleanUrl;
  };

  const fetchLatestProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://bkapp-mp8l.onrender.com/products?search=');
      const data = await response.json();
      const productList = data.results || data || [];
      // Sắp xếp mới nhất và lấy 4 cái
      const latest = productList.sort((a: any, b: any) => b.id - a.id).slice(0, 4);
      setProducts(latest);
    } catch (error) {
      console.error('Lỗi fetch sản phẩm:', error);
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
        headers: { 'Authorization': `Token ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        const count = data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartItemCount(count);
      }
    } catch (error) {
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    fetchLatestProducts();
    fetchCartItemCount();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCartItemCount();
    }, [authToken])
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate('SideBar')}>
            <Image source={require('../assets/ic_menu.png')} style={styles.menuIcon} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Image source={require('../assets/ic_user.png')} style={styles.avatar} />
            <Text style={styles.greetingText} numberOfLines={1}>Chào, {userName}!</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('ChatList')}>
            <Image source={require('../assets/ic_message.png')} style={styles.cartIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
            <Image source={require('../assets/ic_bag.png')} style={styles.cartIcon} />
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemCount > 9 ? '9+' : cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4D5BFF" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View>
              {/* Banner */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.bannerContainer}
                onPress={() => navigation.navigate('Search')}
              >
                <LinearGradient colors={['#6C8CFF', '#8FB1FF']} style={styles.banner}>
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>NEW YEAR SALE</Text>
                    <Text style={styles.bannerSubtitle}>Ưu đãi lớn đến 80%</Text>
                    <Text style={styles.bannerCallToAction}>Mua ngay! →</Text>
                  </View>
                  <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2086/2086578.png' }}
                    style={styles.bannerImage}
                  />
                </LinearGradient>
              </TouchableOpacity>

              {/* Tiêu đề mục sản phẩm mới */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Những sản phẩm mới</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                  <Text style={styles.seeAllText}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.card}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: fixHttpToHttps(item.image) }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.productName} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.priceText}>
                  {parseInt(item.price).toLocaleString('vi-VN')} ₫
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Nút Search nổi */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Search')}
      >
        <LinearGradient colors={['#4D5BFF', '#8FA8FF']} style={styles.floatingGradient}>
          <Image source={require('../assets/ic_search.png')} style={styles.searchIcon} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}