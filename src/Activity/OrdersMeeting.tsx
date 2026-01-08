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
import useAuth from '../components/Header/Header'; // Adjust path if needed

export default function OrdersMeeting() {
  const { token: authToken } = useAuth();
  const currentUserId = 2; // Thay bằng ID user thật từ auth/profile

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

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    if (!authToken) {
      setError('Vui lòng đăng nhập để xem lịch hẹn');
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

      // Lọc status 'DE' (hoặc thay bằng status thực tế của backend cho meeting)
      const meetingOrders = data.filter((order: any) => order.status === 'DE');

      setMeetings(meetingOrders);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('Lỗi fetch:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
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

    Alert.alert('Xác nhận', `Hủy đơn #${selectedMeetingId} vì "${selectedReason}"?`, [
      { text: 'Hủy' },
      {
        text: 'Hủy hẹn',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Thành công', 'Đã hủy hẹn');
          setShowCancelModal(false);
          setSelectedMeetingId(null);
          setSelectedReason(null);
          fetchMeetings();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C69FF" />
        <Text style={styles.loadingText}>Đang tải lịch hẹn...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchMeetings}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (meetings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có lịch hẹn nào</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {meetings.map(order => {
          const isSeller = order.seller === currentUserId;
          const roleLabel = isSeller
            ? `Bạn đang bán cho ${order.buyer_name}`
            : `Bạn đang mua từ ${order.seller_name}`;

          const statusLabel = 'Đang chờ gặp mặt';
          const statusColor = '#4C69FF';
          const statusIcon = 'people-outline';

          return (
            <View key={order.id} style={styles.meetingCard}>
              <Text style={styles.meetingId}>Hẹn gặp #{order.id}</Text>

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

              {/* Info box */}
              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Ionicons name={statusIcon} size={18} color={statusColor} style={styles.icon} />
                  <Text style={[styles.infoText, { color: statusColor }]}>{statusLabel}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="document-text-outline" size={18} color="#4C69FF" style={styles.icon} />
                  <Text style={[styles.infoText, { fontStyle: 'italic' }]}>
                    “Gặp tại {order.shipping_address || 'chưa xác định'}”
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={18} color="#888" style={styles.icon} />
                  <Text style={styles.time}>
                    {new Date(order.created_at).toLocaleString('vi-VN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.chatBtn}>
                  <Ionicons name="chatbubble-outline" size={16} color="#4C69FF" style={{ marginRight: 8 }} />
                  <Text style={styles.chatText}>Nhắn tin</Text>
                </TouchableOpacity>

                {isSeller ? (
                  <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleMarkAsDone(order.id)}>
                    <LinearGradient
                      colors={['#5565FB', '#5599FB']}
                      style={styles.gradientBtn}
                    >
                      <Text style={styles.gradientText}>Đánh dấu hoàn tất</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.gradientWrapper} onPress={() => handleDecline(order.id)}>
                    <LinearGradient
                      colors={['#FF4C96', '#FF6FB5']}
                      style={styles.gradientBtn}
                    >
                      <Text style={styles.gradientText}>Hủy hẹn</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal Hủy hẹn */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setShowCancelModal(false)}
          style={styles.modalBackdrop}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Lý do hủy hẹn</Text>

            {cancellationReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.reasonItem,
                  selectedReason === reason && styles.reasonSelected,
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.confirmCancelBtn} onPress={confirmCancel}>
              <Text style={styles.confirmCancelText}>Xác nhận hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                setShowCancelModal(false);
                setSelectedReason(null);
              }}
            >
              <Text style={styles.backText}>Quay lại</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/* Styles - Đã bổ sung retryText, emptyContainer, emptyText */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#F94D4D', textAlign: 'center', marginBottom: 16 },
  retryText: { color: '#4C69FF', fontWeight: '600', fontSize: 16, marginTop: 12 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },

  meetingCard: {
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
  meetingId: { fontWeight: '700', fontSize: 16, color: '#333', marginBottom: 12 },
  productsList: { marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  name: { fontSize: 15, fontWeight: '600', color: '#000' },
  price: { color: '#4C69FF', fontWeight: '600', marginTop: 2 },
  infoBox: {
    backgroundColor: '#F7F8FF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  icon: { marginRight: 8 },
  infoText: { color: '#333', fontSize: 14, fontWeight: '500' },
  time: { color: '#888', fontSize: 13, marginTop: 4 },
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
  gradientWrapper: { borderRadius: 10, overflow: 'hidden' },
  gradientBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  gradientText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  reasonItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  reasonSelected: {
    backgroundColor: '#F2F4FF',
    borderRadius: 8,
  },
  reasonText: { fontSize: 15, color: '#333' },
  confirmCancelBtn: {
    backgroundColor: '#F94D4D',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmCancelText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backBtn: {
    borderWidth: 1,
    borderColor: '#4C69FF',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  backText: { color: '#4C69FF', fontWeight: '600', fontSize: 16 },
});