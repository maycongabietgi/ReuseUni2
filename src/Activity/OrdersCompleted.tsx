import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from '../components/Header/Header'; // Adjust path if needed

export default function OrdersCompleted({ navigation }: any) {
  const { token: authToken } = useAuth();
  const currentUserId = 2; // Thay bằng ID user hiện tại (lấy từ auth/profile)

  const [completedTrades, setCompletedTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    if (!authToken) {
      setError('Vui lòng đăng nhập để xem đơn hàng đã hoàn tất');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://bkapp-mp8l.onrender.com/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Lỗi ${response.status}: ${errText}`);
      }

      const data = await response.json();

      // Lọc chỉ những đơn có status = "CM" (Completed)
      const completed = data.filter((order: any) => order.status === 'CM');

      setCompletedTrades(completed);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('Lỗi fetch completed orders:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
        <Text style={styles.loadingText}>Đang tải đơn hàng đã hoàn tất...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchCompletedOrders}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (completedTrades.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có đơn hàng nào hoàn tất</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {completedTrades.map(order => {
        const isSeller = order.seller === currentUserId;
        const roleLabel = isSeller
          ? `Bạn đã bán cho ${order.buyer_name}`
          : `Bạn đã mua từ ${order.seller_name}`;

        const totalQuantity = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

        return (
          <View key={order.id} style={styles.tradeCard}>
            <Text style={styles.tradeId}>Giao dịch #{order.id}</Text>

            {/* Danh sách sản phẩm */}
            <View style={styles.productsList}>
              {order.items.map((item: any) => (
                <View key={item.id} style={styles.row}>
                  <Image source={{ uri: item.product_image }} style={styles.image} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.product_title}</Text>
                    <Text style={styles.price}>
                      {Number(item.price).toLocaleString('vi-VN')} ₫ × {item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Thông tin tổng */}
            <View style={styles.infoRow}>
              <Text style={styles.totalPrice}>
                Tổng: {Number(order.total_price).toLocaleString('vi-VN')} ₫
              </Text>
              <Text style={styles.date}>
                {new Date(order.created_at).toLocaleString('vi-VN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </Text>
            </View>

            <Text style={styles.role}>{roleLabel}</Text>

            {/* Status */}
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#2ECC71" />
              <Text style={styles.statusText}>Hoàn tất</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.chatBtn}>
                <Ionicons name="chatbubble-outline" size={16} color="#4C69FF" style={{ marginRight: 8 }} />
                <Text style={styles.chatText}>Nhắn</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reviewWrapper}
                onPress={() => navigation.navigate('Review', { tradeId: order.id })}
              >
                <LinearGradient
                  colors={['#5565FB', '#5599FB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.9, y: 0.8 }}
                  style={styles.reviewBtn}
                >
                  <Text style={styles.reviewText}>Đánh giá</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#F94D4D', textAlign: 'center', marginBottom: 16 },
  retryText: { color: '#4C69FF', fontWeight: '600', fontSize: 16, marginTop: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },

  tradeCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E8F0',
  },
  tradeId: { fontWeight: '700', fontSize: 16, color: '#333', marginBottom: 12 },
  productsList: { marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  name: { fontSize: 15, fontWeight: '600', color: '#000' },
  price: { color: '#4C69FF', fontWeight: '600', marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  totalPrice: { fontSize: 16, fontWeight: '700', color: '#000' },
  date: { color: '#888', fontSize: 13 },
  role: { color: '#555', fontSize: 13, marginTop: 8 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F9EE',
    padding: 10,
    borderRadius: 10,
    marginVertical: 12,
  },
  statusText: {
    color: '#2ECC71',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4C69FF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  chatText: { color: '#4C69FF', fontWeight: '600', marginLeft: 8 },
  reviewWrapper: { borderRadius: 10, overflow: 'hidden' },
  reviewBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  reviewText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});