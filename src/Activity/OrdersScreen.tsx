import React, { useState, useCallback } from 'react'; // Thêm useCallback
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Thêm hook này
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

// Tabs
import OrdersRequested from './OrdersRequested';
import OrdersMeeting from './OrdersMeeting';
import OrdersCompleted from './OrdersCompleted';
import OrdersCancelled from './OrdersCancelled';

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

type Props = {
  navigation: OrdersScreenNavigationProp;
  route: { params?: { defaultTab?: 'requested' | 'meeting' | 'completed' | 'cancelled' } };
};

export default function OrdersScreen({ navigation, route }: Props) {
  const defaultTab = route.params?.defaultTab || 'requested';
  const [activeTab, setActiveTab] = useState<'requested' | 'meeting' | 'completed' | 'cancelled'>(defaultTab);

  // State này dùng để kích hoạt việc render lại các component con
  const [refreshKey, setRefreshKey] = useState(0);

  // useFocusEffect sẽ chạy mỗi khi bạn quay lại màn hình này
  useFocusEffect(
    useCallback(() => {
      // Mỗi khi quay lại, ta tăng giá trị key để buộc các tab component fetch lại data
      setRefreshKey(prev => prev + 1);

      return () => {
        // Có thể thực hiện cleanup ở đây nếu cần
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giao dịch</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { key: 'requested', label: 'Yêu cầu' },
          { key: 'meeting', label: 'Giao hàng' },
          { key: 'completed', label: 'Hoàn thành' },
          { key: 'cancelled', label: 'Đã hủy' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key as any)}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content - Truyền refreshKey vào để component biết khi nào cần load lại */}
      {activeTab === 'requested' && <OrdersRequested key={`req-${refreshKey}`} />}
      {activeTab === 'meeting' && <OrdersMeeting key={`meet-${refreshKey}`} />}
      {activeTab === 'completed' && <OrdersCompleted navigation={navigation} key={`comp-${refreshKey}`} />}
      {activeTab === 'cancelled' && <OrdersCancelled key={`can-${refreshKey}`} />}
    </View>
  );
}

/* Giữ nguyên phần styles của bạn */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 25,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#000' },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30,
  },
  tab: {
    borderWidth: 1,
    borderColor: '#C9CFE5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tabActive: { backgroundColor: '#4C69FF', borderColor: '#4C69FF' },
  tabText: { color: '#C9CFE5', fontWeight: '500' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
});