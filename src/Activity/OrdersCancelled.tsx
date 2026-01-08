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
import useAuth from '../components/Header/Header'; // Điều chỉnh path nếu cần

export default function OrdersCancelled() {
  const { token: authToken } = useAuth(); // Lấy token từ auth context/hook
  const currentUserId = 2; // Thay bằng ID user hiện tại (từ auth/profile)

  const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  const fetchCancelledOrders = async () => {
    if (!authToken) {
      setError('Vui lòng đăng nhập để xem đơn hàng đã hủy');
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

      // Lọc chỉ những đơn có status = "CA" (Cancelled)
      const cancelled = data.filter((order: any) => order.status === 'CA');

      setCancelledOrders(cancelled);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('Lỗi fetch cancelled orders:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (orderId: number) => {
    Alert.alert('Đặt lại hàng', `Bạn muốn đặt lại đơn hàng #${orderId}?`, [
      { text: 'Hủy' },
      {
        text: 'Đặt lại',
        onPress: () => {
          // TODO: Gọi API tạo đơn mới dựa trên order cũ
          Alert.alert('Thành công', 'Đã tạo lại đơn hàng');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F94D4D" />
        <Text style={styles.loadingText}>Đang tải đơn hàng đã hủy...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchCancelledOrders}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (cancelledOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có đơn hàng nào bị hủy</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {cancelledOrders.map(order => {
        const isSeller = order.seller === currentUserId;
        const roleLabel = isSeller
          ? `Bạn đã từ chối ${order.buyer_name}`
          : `Bạn đã hủy đơn từ ${order.seller_name}`;

        const cancelReason = order.cancel_reason || 'Không có lý do cụ thể'; // Nếu backend có field cancel_reason

        return (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderId}>Hủy đơn #{order.id}</Text>

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
              <Text style={styles.time}>
                {new Date(order.created_at).toLocaleString('vi-VN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </Text>
            </View>

            <Text style={styles.role}>{roleLabel}</Text>
            <Text style={styles.reason}>Lý do: {cancelReason}</Text>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.chatWrapper}>
                <LinearGradient
                  colors={['#5565FB', '#5599FB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.9, y: 0.8 }}
                  style={styles.chatBtn}
                >
                  <Ionicons name="chatbubble-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                  <Text style={styles.chatText}>Nhắn tin</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reorderWrapper}
                onPress={() => handleReorder(order.id)}
              >
                {/* <LinearGradient
                  colors={['#FF4C96', '#FF6FB5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.9, y: 0.8 }}
                  style={styles.reorderBtn}
                >
                  <Ionicons name="refresh-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
                  <Text style={styles.reorderText}>Đặt lại</Text>
                </LinearGradient> */}
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

  orderCard: {
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
  orderId: { fontWeight: '700', fontSize: 16, color: '#333', marginBottom: 12 },
  productsList: { marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  name: { fontSize: 15, fontWeight: '600', color: '#000' },
  price: { color: '#4C69FF', fontWeight: '600', marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  totalPrice: { fontSize: 16, fontWeight: '700', color: '#000' },
  time: { color: '#888', fontSize: 13 },
  role: { color: '#555', fontSize: 13, marginTop: 8 },
  reason: { color: '#E74C3C', fontSize: 13, marginTop: 8, fontWeight: '500' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  chatWrapper: { borderRadius: 10, overflow: 'hidden', flex: 1, marginRight: 8 },
  reorderWrapper: { borderRadius: 10, overflow: 'hidden', flex: 1, marginLeft: 8 },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  chatText: { color: '#fff', fontWeight: '600', fontSize: 14, marginLeft: 8 },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  reorderText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});