import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import useAuth from '../components/Header/Header';
import ProductsTab from './ProductsTab';
import ProfileTab from './ProfileTab';

type MyShopNavProp = NativeStackNavigationProp<RootStackParamList, 'MyShop'>;
type Props = { navigation: MyShopNavProp };

interface UserProfile {
  id: number;
  name: string;
  profile_picture: string | null;
  address?: string;
  email: string;
  rating?: number;
  num_reviews?: number;
}

export default function MyShopScreen({ navigation }: Props) {
  const { token: authToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'profile'>('products');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) {
        setError('Vui lòng đăng nhập để xem cửa hàng');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
          method: 'GET',
          headers: {
            Authorization: `Token ${authToken}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Lỗi ${response.status}: ${errText}`);
        }

        const data: UserProfile = await response.json();
        setProfile(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Không thể tải thông tin cửa hàng';
        console.error('Lỗi fetch profile:', err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D7FF9" />
        <Text style={styles.loadingText}>Đang tải cửa hàng...</Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Không thể tải thông tin cửa hàng'}</Text>
        <TouchableOpacity onPress={() => { /* retry */ }}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          {/* Search */}
          <TouchableOpacity>
            <Ionicons name="search-outline" size={22} color="#000" />
          </TouchableOpacity>

          {/* Inbox */}
          <TouchableOpacity style={{ marginLeft: 14 }}>
            <Ionicons name="mail-outline" size={22} color="#000" />
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            style={{ marginLeft: 14 }}
            onPress={() => navigation.navigate('ShopSettings')}
          >
            <Ionicons name="settings-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Shop Info */}
      <View style={styles.shopInfo}>
        <Image
          source={{
            uri: profile.profile_picture || 'https://i.imgur.com/ZcLLrkY.png',
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.shopName}>{profile.name || 'Cửa hàng của bạn'}</Text>
          <Text style={styles.shopDesc}>
            {profile.address || 'Chưa có mô tả'} • {profile.rating?.toFixed(1) || '0.0'} ⭐ ({profile.num_reviews || 0} đánh giá)
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => setActiveTab('products')}
          style={[styles.tabItem, activeTab === 'products' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'products' && styles.activeTabText,
            ]}
          >
            Sản phẩm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('profile')}
          style={[styles.tabItem, activeTab === 'profile' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'profile' && styles.activeTabText,
            ]}
          >
            Hồ sơ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'products' ? (
        <ProductsTab navigation={navigation} />
      ) : (
        <ProfileTab />
      )}
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: { width: 60, height: 60, borderRadius: 12, marginRight: 12 },
  shopName: { fontSize: 18, fontWeight: '700' },
  shopDesc: { fontSize: 13, color: '#666' },

  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabText: { color: '#777', fontSize: 15 },
  activeTab: { borderBottomWidth: 2, borderColor: '#2D7FF9' },
  activeTabText: { color: '#2D7FF9', fontWeight: '600' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F94D4D',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    marginTop: 16,
    color: '#2D7FF9',
    fontWeight: '600',
  },
});