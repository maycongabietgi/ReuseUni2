import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

// Tabs (you can rename or replace these later)
import OrdersRequested from './OrdersRequested';
import OrdersMeeting from './OrdersMeeting';
import OrdersCompleted from './OrdersCompleted';
import OrdersCancelled from './OrdersCancelled';

type OrdersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Orders'
>;

type Props = {
  navigation: OrdersScreenNavigationProp;
  route: { params?: { defaultTab?: 'requested' | 'meeting' | 'completed' | 'cancelled' } };
};

export default function OrdersScreen({ navigation, route }: Props) {
  const defaultTab = route.params?.defaultTab || 'requested';

  const [activeTab, setActiveTab] = useState<
    'requested' | 'meeting' | 'completed' | 'cancelled'
  >(defaultTab);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Exchanges</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { key: 'requested', label: 'Requested' },
          { key: 'meeting', label: 'Meeting' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' },
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

      {/* Tab content */}
      {activeTab === 'requested' && <OrdersRequested />}
      {activeTab === 'meeting' && <OrdersMeeting />}
      {activeTab === 'completed' && <OrdersCompleted navigation={navigation} />}
      {activeTab === 'cancelled' && <OrdersCancelled />}
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
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
