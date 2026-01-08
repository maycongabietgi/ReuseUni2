import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import useAuth from '../components/Header/Header'; // Điều chỉnh path nếu cần

type ActivityScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Activity'
>;
type Props = {
  navigation: ActivityScreenNavigationProp;
};

interface Order {
  id: number;
  status: string;
}

export default function ActivityScreen({ navigation }: Props) {
  const { token: authToken } = useAuth();
  const [orderCounts, setOrderCounts] = useState({
    requested: 0, // PE - Yêu cầu
    meeting: 0,   // DE - Hẹn gặp
    completed: 0, // CM - Hoàn tất
    cancelled: 0, // CA - Đã hủy
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderCounts = async () => {
    if (!authToken) {
      setError('Vui lòng đăng nhập để xem hoạt động');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://bkapp-mp8l.onrender.com/orders', {
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

      const data: Order[] = await response.json();
      setOrderCounts({
        requested: data.filter(o => o.status === 'PE').length,
        meeting: data.filter(o => o.status === 'DE').length,
        completed: data.filter(o => o.status === 'CM').length,
        cancelled: data.filter(o => o.status === 'CA').length,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderCounts();
  }, [authToken]);

  const notifications = [
    {
      id: 1,
      icon: 'chatbubble-ellipses-outline',
      title: 'Bạn có tin nhắn mới',
      desc: 'Có tin nhắn mới về các giao dịch đang diễn ra.',
      time: 'Vừa xong',
      onPress: () => navigation.navigate('ChatList'), // Chuyển đến trang ChatList
    },
    {
      id: 2,
      icon: 'heart-outline',
      title: 'Có người thích bài đăng của bạn',
      desc: 'Một số người dùng đã thích sản phẩm của bạn.',
      time: 'Gần đây',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      icon: 'checkmark-done-circle-outline',
      title: 'Bạn đã đánh dấu một sản phẩm là đã bán',
      desc: 'Giao dịch đã hoàn tất thành công.',
      time: '1 ngày trước',
    },
    {
      id: 2,
      icon: 'add-circle-outline',
      title: 'Bạn đã đăng sản phẩm mới',
      desc: 'Sản phẩm mới đã hiển thị cho người mua.',
      time: '3 ngày trước',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hoạt động</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Trạng thái giao dịch */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D7FF9" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.orderStatusContainer}>
          <View style={styles.orderRow}>
            <TouchableOpacity
              style={styles.statusItem}
              onPress={() => navigation.navigate('Orders', { defaultTab: 'requested' })}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="cart-outline" size={22} color="#000" />
                {orderCounts.requested > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{orderCounts.requested}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statusLabel}>Yêu cầu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusItem}
              onPress={() => navigation.navigate('Orders', { defaultTab: 'meeting' })}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="people-outline" size={22} color="#000" />
                {orderCounts.meeting > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{orderCounts.meeting}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statusLabel}>Hẹn gặp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusItem}
              onPress={() => navigation.navigate('Orders', { defaultTab: 'completed' })}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="checkmark-circle-outline" size={22} color="#000" />
                {orderCounts.completed > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{orderCounts.completed}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statusLabel}>Hoàn tất</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusItem}
              onPress={() => navigation.navigate('Orders', { defaultTab: 'cancelled' })}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="close-circle-outline" size={22} color="#000" />
                {orderCounts.cancelled > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{orderCounts.cancelled}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.statusLabel}>Đã hủy</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.viewOrderBtn}>
            <Text style={styles.viewOrderText}>Xem tất cả giao dịch</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Nội dung chính */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Thông báo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông báo</Text>
            <TouchableOpacity>
              <Text style={styles.clearText}>Xóa</Text>
            </TouchableOpacity>
          </View>

          {notifications.map(n => (
            <TouchableOpacity
              key={n.id}
              style={styles.card}
              onPress={n.onPress} // Chuyển đến ChatList khi nhấn "Bạn có tin nhắn mới"
            >
              <Ionicons
                name={n.icon}
                size={24}
                color="#2D7FF9"
                style={{ marginRight: 10, alignSelf: 'center' }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.desc}>{n.desc}</Text>
                <Text style={styles.time}>{n.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hoạt động gần đây */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          {recentActivities.map(a => (
            <View key={a.id} style={styles.card}>
              <Ionicons
                name={a.icon}
                size={24}
                color="#2D7FF9"
                style={{ marginRight: 10, alignSelf: 'center' }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{a.title}</Text>
                <Text style={styles.desc}>{a.desc}</Text>
                <Text style={styles.time}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#000' },

  orderStatusContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E3E6EF',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statusItem: { alignItems: 'center' },
  statusLabel: { fontSize: 13, color: '#444', marginTop: 4 },
  viewOrderBtn: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#4C69FF',
    borderRadius: 12,
    paddingVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  viewOrderText: { color: '#4C69FF', fontWeight: '600', fontSize: 15 },

  iconWrapper: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#FF4C96',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },

  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  clearText: { color: '#FF4C96', fontWeight: '500' },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E3E6EF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  title: { fontSize: 14, fontWeight: '600', color: '#333' },
  desc: { fontSize: 13, color: '#666', marginTop: 2 },
  time: { fontSize: 12, color: '#999', marginTop: 4 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
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
  },
});