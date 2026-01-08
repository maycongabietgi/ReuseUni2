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
import { useNavigation } from '@react-navigation/native';
import useAuth from '../components/Header/Header';

// --- Interfaces ---
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
  const navigation = useNavigation<any>();
  const { token: authToken } = useAuth();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [requests, setRequests] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Lấy thông tin người dùng hiện tại
  useEffect(() => {
    const fetchCurrentUserId = async () => {
      if (!authToken) return;
      try {
        const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
          method: 'GET',
          headers: {
            Authorization: `Token ${authToken}`,
            Accept: 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.id);
        }
      } catch (err) {
        console.error('Lỗi fetch user ID:', err);
      }
    };
    fetchCurrentUserId();
  }, [authToken]);

  // 2. Lấy danh sách đơn hàng
  useEffect(() => {
    fetchOrders();
  }, [authToken]);

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

      if (!response.ok) throw new Error(`Lỗi ${response.status}`);

      const data: Order[] = await response.json();
      // Chỉ lấy các đơn hàng đang ở trạng thái PE (Pending)
      const pending = data.filter((order: Order) => order.status === 'PE');
      setRequests(pending);
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  // --- Hàm xử lý API ---

  // Chấp nhận đơn (Dành cho Seller)
  const handleAccept = (orderId: number) => {
    Alert.alert('Chấp nhận', `Bạn đồng ý thực hiện đơn hàng #${orderId}?`, [
      { text: 'Hủy' },
      {
        text: 'Đồng ý',
        onPress: async () => {
          try {
            const response = await fetch(`https://bkapp-mp8l.onrender.com/orders/${orderId}/accept/`, {
              method: 'POST',
              headers: { Authorization: `Token ${authToken}` },
            });
            if (response.ok) {
              Alert.alert('Thành công', 'Đã chấp nhận đơn hàng');
              fetchOrders();
            } else {
              throw new Error('Không thể chấp nhận đơn');
            }
          } catch (err) {
            Alert.alert('Lỗi', 'Thao tác thất bại');
          }
        },
      },
    ]);
  };

  // Từ chối đơn (Dành cho Seller)
  const handleDecline = (orderId: number) => {
    Alert.alert('Từ chối', `Bạn muốn từ chối đơn hàng #${orderId}?`, [
      { text: 'Hủy' },
      {
        text: 'Từ chối',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`https://bkapp-mp8l.onrender.com/orders/${orderId}/decline/`, {
              method: 'POST',
              headers: { Authorization: `Token ${authToken}` },
            });
            if (response.ok) {
              Alert.alert('Thành công', 'Đã từ chối đơn hàng');
              fetchOrders();
            }
          } catch (err) {
            Alert.alert('Lỗi', 'Thao tác thất bại');
          }
        },
      },
    ]);
  };

  // Hủy yêu cầu (Dành cho Buyer) - Đoạn code bạn vừa gửi
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
            fetchOrders();
          } catch (err: any) {
            Alert.alert('Lỗi', err.message || 'Không thể hủy đơn hàng');
          }
        },
      },
    ]);
  };

  // Nhắn tin
  const handleChat = async (targetUserId: number) => {
    if (!authToken) return;
    try {
      const response = await fetch('https://bkapp-mp8l.onrender.com/chats/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify({ target_user_id: targetUserId }),
      });
      const result = await response.json();
      if (response.ok && result.chat_id) {
        navigation.navigate('ChatDetail', { chatId: result.chat_id });
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở cuộc trò chuyện');
    }
  };

  const fixHttpToHttps = (url: string | null | undefined): string => {
    if (!url) return '';
    return url.startsWith('http://') ? url.replace(/^http:\/\//i, 'https://') : url;
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4C69FF" />
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {requests.map(order => {
        const isSeller = order.seller === currentUserId;
        const chatWithId = isSeller ? order.buyer : order.seller;

        return (
          <View key={order.id} style={styles.requestContainer}>
            <Text style={styles.requestId}>Đơn hàng #{order.id}</Text>

            <View style={styles.productsList}>
              {order.items.map(item => (
                <View key={item.id} style={styles.productCard}>
                  <Image source={{ uri: fixHttpToHttps(item.product_image) }} style={styles.image} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.product_title}</Text>
                    <Text style={styles.price}>
                      {Number(item.price).toLocaleString('vi-VN')} ₫ × {item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.totalPrice}>Tổng: {Number(order.total_price).toLocaleString('vi-VN')} ₫</Text>
              <Text style={styles.time}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</Text>
            </View>

            <Text style={styles.party}>{isSeller ? `Người mua: ${order.buyer_name}` : `Người bán: ${order.seller_name}`}</Text>
            <Text style={styles.address}>Giao tới: {order.shipping_address}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.chatBtn} onPress={() => handleChat(chatWithId)}>
                <Ionicons name="chatbubble-outline" size={18} color="#4C69FF" />
                <Text style={styles.chatText}>Nhắn tin</Text>
              </TouchableOpacity>

              {isSeller ? (
                <View style={styles.rightButtons}>
                  <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleAccept(order.id)}>
                    <LinearGradient colors={['#5565FB', '#5599FB']} style={styles.gradientBtn}>
                      <Text style={styles.gradientText}>Chấp nhận</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleDecline(order.id)}>
                    <LinearGradient colors={['#FF4C96', '#FF6FB5']} style={styles.gradientBtn}>
                      <Text style={styles.gradientText}>Từ chối</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleCancel(order.id)}>
                  <LinearGradient colors={['#FF4C96', '#FF6FB5']} style={styles.gradientBtn}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  requestContainer: {
    margin: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16,
    elevation: 3, borderWidth: 1, borderColor: '#E5E8F0',
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
  chatBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4C69FF', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 15 },
  chatText: { color: '#4C69FF', fontWeight: '600', marginLeft: 8 },
  rightButtons: { flexDirection: 'row', gap: 8 },
  gradientWrapper: { borderRadius: 10, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center' },
  gradientText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});