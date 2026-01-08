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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../components/Header/Header'; // Adjust path

// Define types based on your API response
interface OrderItem {
  id: number;
  product: number;
  product_title: string;
  product_image: string;
  price: string;
  quantity: number;
}

interface Order {
  id: number;
  buyer: number;
  buyer_name: string;
  seller: number;
  seller_name: string;
  status: string;
  shipping_address: string;
  total_price: string;
  items: OrderItem[];
  created_at: string;
}

export default function OrdersRequested() {
  const { token: authToken } = useAuth(); // Get auth token
  const currentUserId = 2; // Replace with real current user ID from auth/profile

  const [requests, setRequests] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!authToken) {
      setError('Vui lòng đăng nhập để xem đơn hàng');
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

      const data: Order[] = await response.json();

      // Filter only pending orders (status === 'PE')
      const pending = data.filter((order: Order) => order.status === 'PE');

      setRequests(pending);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('Lỗi fetch orders:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (orderId: number) => {
    Alert.alert('Chấp nhận', `Bạn có chắc chắn muốn chấp nhận đơn hàng #${orderId}?`, [
      { text: 'Hủy' },
      {
        text: 'Chấp nhận',
        onPress: () => {
          // TODO: Gọi API PATCH /orders/{id}/accept
          Alert.alert('Thành công', 'Đã chấp nhận đơn hàng');
          fetchOrders(); // Refresh list
        },
      },
    ]);
  };

  const handleDecline = (orderId: number) => {
    Alert.alert('Từ chối', `Bạn có chắc chắn muốn từ chối đơn hàng #${orderId}?`, [
      { text: 'Hủy' },
      {
        text: 'Từ chối',
        onPress: () => {
          // TODO: Gọi API PATCH /orders/{id}/decline
          Alert.alert('Thành công', 'Đã từ chối đơn hàng');
          fetchOrders();
        },
      },
    ]);
  };

  const handleCancel = (orderId: number) => {
    Alert.alert('Hủy yêu cầu', `Bạn có chắc chắn muốn hủy đơn hàng #${orderId}?`, [
      { text: 'Hủy' },
      {
        text: 'Hủy yêu cầu',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`https://bkapp-mp8l.onrender.com/orders/${orderId}/cancel`, {
              method: 'POST',
              headers: {
                'Authorization': `Token ${authToken}`,
                'Accept': 'application/json',
              },
            });

            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`Lỗi ${response.status}: ${errText}`);
            }

            const result = await response.json();
            Alert.alert('Thành công', result.message || 'Đã hủy đơn hàng');

            // Refresh danh sách
            fetchOrders();
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Không thể hủy đơn hàng';
            Alert.alert('Lỗi', msg);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C69FF" />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchOrders}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có yêu cầu nào đang chờ xử lý</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {requests.map(order => {
        const isSeller = order.seller === currentUserId;
        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

        return (
          <View key={order.id} style={styles.requestContainer}>
            <Text style={styles.requestId}>Đơn hàng #{order.id}</Text>

            {/* Product list */}
            <View style={styles.productsList}>
              {order.items.map(item => (
                <View key={item.id} style={styles.productCard}>
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

            {/* Summary info */}
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

            <Text style={styles.party}>
              {isSeller ? `Người mua: ${order.buyer_name}` : `Người bán: ${order.seller_name}`}
            </Text>
            <Text style={styles.address}>Địa chỉ: {order.shipping_address}</Text>

            {/* Action buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.chatBtn}>
                <Ionicons name="chatbubble-outline" size={18} color="#4C69FF" />
                <Text style={styles.chatText}>Nhắn tin</Text>
              </TouchableOpacity>

              {isSeller ? (
                <View style={styles.rightButtons}>
                  <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleAccept(order.id)}>
                    <LinearGradient
                      colors={['#5565FB', '#5599FB']}
                      style={styles.gradientBtn}
                    >
                      <Text style={styles.gradientText}>Chấp nhận</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleDecline(order.id)}>
                    <LinearGradient
                      colors={['#FF4C96', '#FF6FB5']}
                      style={styles.gradientBtn}
                    >
                      <Text style={styles.gradientText}>Từ chối</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleCancel(order.id)}>
                  <LinearGradient
                    colors={['#FF4C96', '#FF6FB5']}
                    style={styles.gradientBtn}
                  >
                    <Text style={styles.gradientText}>Hủy yêu cầu</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#F94D4D', textAlign: 'center' },
  retryText: { marginTop: 16, color: '#4C69FF', fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },

  requestContainer: {
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
  requestId: { fontWeight: '700', fontSize: 16, color: '#333', marginBottom: 12 },
  productsList: { marginBottom: 12 },
  productCard: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  name: { fontSize: 15, fontWeight: '600', color: '#000' },
  price: { color: '#4C69FF', fontWeight: '600', marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  totalPrice: { fontSize: 16, fontWeight: '700', color: '#000' },
  time: { color: '#888', fontSize: 13 },
  party: { color: '#444', fontSize: 14, marginTop: 4 },
  address: { color: '#666', fontSize: 13, marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  chatBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4C69FF', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  chatText: { color: '#4C69FF', fontWeight: '600', marginLeft: 8 },
  rightButtons: { flexDirection: 'row', gap: 10 },
  gradientWrapper: { borderRadius: 10, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center' },
  gradientText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});