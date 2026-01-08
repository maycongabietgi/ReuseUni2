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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Thêm navigation
import useAuth from '../components/Header/Header';

export default function OrdersMeeting() {
  const navigation = useNavigation<any>();
  const { token: authToken } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const cancellationReasons = [
    'Tìm được món khác gần hơn',
    'Thay đổi ý định',
    'Người bán không phản hồi',
    'Giá không còn phù hợp',
  ];

  const fixHttpToHttps = (url: string | null | undefined): string => {
    if (!url) return '';
    return url.startsWith('http://') ? url.replace(/^http:\/\//i, 'https://') : url;
  };

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      if (!authToken) {
        setError('Vui lòng đăng nhập để xem đơn hàng');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
          method: 'GET',
          headers: { Authorization: `Token ${authToken}`, Accept: 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.id);
        }
      } catch (err: any) {
        setError(err.message || 'Không thể xác định người dùng');
      }
    };
    fetchCurrentUserId();
  }, [authToken]);

  useEffect(() => {
    fetchMeetings();
  }, [authToken]);

  const fetchMeetings = async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      const response = await fetch('https://bkapp-mp8l.onrender.com/orders', {
        method: 'GET',
        headers: { 'Authorization': `Token ${authToken}`, 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error(`Lỗi ${response.status}`);
      const data = await response.json();
      const meetingOrders = data.filter((order: any) => order.status === 'DE');
      setMeetings(meetingOrders);
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  // HÀM CHAT ĐÃ GHÉP
  const handleChat = async (targetUserId: number) => {
    if (!authToken) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để chat');
      return;
    }
    if (currentUserId && targetUserId === currentUserId) {
      Alert.alert('Thông báo', 'Không thể chat với chính mình.');
      return;
    }

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
      if (!response.ok) throw new Error(result.message || 'Không thể khởi tạo chat');

      const chatId = result.chat_id;
      if (chatId) {
        navigation.navigate('ChatDetail', { chatId });
      } else {
        Alert.alert('Lỗi', 'Không nhận được chat ID');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể mở chat');
    }
  };

  const handleMarkAsDone = (orderId: number) => {
    Alert.alert('Hoàn tất', `Xác nhận giao dịch #${orderId} thành công?`, [
      { text: 'Hủy' },
      { text: 'Hoàn tất', onPress: () => Alert.alert('Đã hoàn tất') },
    ]);
  };

  const handleDecline = (orderId: number) => {
    setSelectedMeetingId(orderId);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (!selectedMeetingId || !selectedReason) {
      Alert.alert('Lỗi', 'Vui lòng chọn lý do hủy');
      return;
    }
    Alert.alert('Xác nhận', `Hủy đơn #${selectedMeetingId}?`, [
      { text: 'Hủy' },
      {
        text: 'Hủy hẹn',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Thành công', 'Đã hủy hẹn');
          setShowCancelModal(false);
          fetchMeetings();
        },
      },
    ]);
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4C69FF" />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {meetings.map(order => {
          const isSeller = order.seller === currentUserId;
          // Xác định ID đối phương để nhắn tin
          const chatWithId = isSeller ? order.buyer : order.seller;

          return (
            <View key={order.id} style={styles.meetingCard}>
              <Text style={styles.meetingId}>Hẹn gặp #{order.id}</Text>

              <View style={styles.productsList}>
                {order.items.map((item: any) => (
                  <View key={item.id} style={styles.row}>
                    <Image source={{ uri: fixHttpToHttps(item.product_image) }} style={styles.image} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{item.product_title}</Text>
                      <Text style={styles.price}>{Number(item.price).toLocaleString('vi-VN')} ₫</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={18} color="#4C69FF" style={styles.icon} />
                  <Text style={[styles.infoText, { color: '#4C69FF' }]}>Đang chờ gặp mặt</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={18} color="#4C69FF" style={styles.icon} />
                  <Text style={styles.infoText}>Tại: {order.shipping_address || 'Địa điểm đã hẹn'}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.chatBtn}
                  onPress={() => handleChat(chatWithId)}
                >
                  <Ionicons name="chatbubble-outline" size={16} color="#4C69FF" style={{ marginRight: 8 }} />
                  <Text style={styles.chatText}>Nhắn tin</Text>
                </TouchableOpacity>

                {isSeller ? (
                  <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleMarkAsDone(order.id)}>
                    <LinearGradient colors={['#5565FB', '#5599FB']} style={styles.gradientBtn}>
                      <Text style={styles.gradientText}>Hoàn tất</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleDecline(order.id)}>
                    <LinearGradient colors={['#FF4C96', '#FF6FB5']} style={styles.gradientBtn}>
                      <Text style={styles.gradientText}>Hủy hẹn</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal Hủy hẹn giữ nguyên như code của bạn */}
      <Modal visible={showCancelModal} transparent animationType="fade">
        <TouchableOpacity activeOpacity={1} style={styles.modalBackdrop} onPress={() => setShowCancelModal(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Lý do hủy hẹn</Text>
            {cancellationReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.reasonItem, selectedReason === reason && styles.reasonSelected]}
                onPress={() => setSelectedReason(reason)}
              >
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.confirmCancelBtn} onPress={confirmCancel}>
              <Text style={styles.confirmCancelText}>Xác nhận hủy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  meetingCard: {
    margin: 16, backgroundColor: '#fff', borderRadius: 14, padding: 16,
    elevation: 3, borderWidth: 1, borderColor: '#E5E8F0',
  },
  meetingId: { fontWeight: '700', fontSize: 16, color: '#333', marginBottom: 12 },
  productsList: { marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  name: { fontSize: 15, fontWeight: '600', color: '#000' },
  price: { color: '#4C69FF', fontWeight: '600', marginTop: 2 },
  infoBox: { backgroundColor: '#F7F8FF', padding: 12, borderRadius: 10, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  icon: { marginRight: 8 },
  infoText: { color: '#333', fontSize: 14, fontWeight: '500' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatBtn: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4C69FF',
    borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18, flex: 1, marginRight: 8
  },
  chatText: { color: '#4C69FF', fontWeight: '600' },
  gradientWrapper: { borderRadius: 10, overflow: 'hidden', flex: 1.5 },
  gradientBtn: { paddingVertical: 10, alignItems: 'center' },
  gradientText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  reasonItem: { paddingVertical: 14, borderBottomWidth: 1, borderColor: '#eee' },
  reasonSelected: { backgroundColor: '#F2F4FF', borderRadius: 8 },
  reasonText: { fontSize: 15, color: '#333' },
  confirmCancelBtn: { backgroundColor: '#F94D4D', borderRadius: 12, paddingVertical: 14, marginTop: 20, alignItems: 'center' },
  confirmCancelText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});