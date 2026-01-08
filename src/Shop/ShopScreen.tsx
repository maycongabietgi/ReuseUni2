import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import useAuth from '../components/Header/Header';
import ProductsTab from './ProductsTab';
import ProfileTab from './ProfileTab'; // Chính là ProfileTab của bạn

export default function ShopScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { token: authToken } = useAuth();

  // Ưu tiên lấy sellerId từ params, nếu không có thì sẽ fetch profile "me" sau
  const [sellerId, setSellerId] = useState<number | null>(route.params?.sellerId || null);
  const [activeTab, setActiveTab] = useState<'products' | 'profile'>('products');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initShop = async () => {
      try {
        setLoading(true);
        let targetId = sellerId;

        // Nếu không có sellerId truyền vào, lấy ID của chính mình
        if (!targetId && authToken) {
          const meRes = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
            headers: { Authorization: `Token ${authToken}` },
          });
          const meData = await meRes.json();
          targetId = meData.id;
          setSellerId(targetId);
        }

        if (!targetId) throw new Error("Không xác định được ID người bán");

        // Lấy thông tin chi tiết user từ API public theo yêu cầu
        const res = await fetch(`https://bkapp-mp8l.onrender.com/api/users/${targetId}/`);
        if (!res.ok) throw new Error('Lỗi tải thông tin người dùng');

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể tải thông tin cửa hàng');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    initShop();
  }, [sellerId, authToken]);

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2D7FF9" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cửa hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.shopInfo}>
        <Image
          source={{ uri: profile?.profile_picture || 'https://i.imgur.com/ZcLLrkY.png' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.shopName}>{profile?.name || profile?.username}</Text>
          <Text style={styles.shopDesc}>
            {profile?.address || 'Thành viên Bách Khoa'}
          </Text>
        </View>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => setActiveTab('products')}
          style={[styles.tabItem, activeTab === 'products' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>Sản phẩm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('profile')}
          style={[styles.tabItem, activeTab === 'profile' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>Đánh giá</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'products' ? (
        <ProductsTab sellerId={sellerId} />
      ) : (
        <ProfileTab sellerId={sellerId} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  shopInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 10 },
  avatar: { width: 65, height: 65, borderRadius: 32.5, marginRight: 15, borderWidth: 1, borderColor: '#eee' },
  shopName: { fontSize: 20, fontWeight: '700', color: '#111' },
  shopDesc: { fontSize: 13, color: '#666', marginTop: 4 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', marginBottom: 12 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { color: '#777', fontSize: 15, fontWeight: '500' },
  activeTab: { borderBottomWidth: 2, borderColor: '#2D7FF9' },
  activeTabText: { color: '#2D7FF9', fontWeight: '700' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});