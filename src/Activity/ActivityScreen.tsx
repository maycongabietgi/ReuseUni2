import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type ActivityScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Activity'
>;

type Props = {
  navigation: ActivityScreenNavigationProp;
};

export default function ActivityScreen({ navigation }: Props) {
  const orderCounts = {
    requested: 2, // Someone asked to buy your item
    meeting: 1, // You’re arranging or meeting in person
    completed: 3, // Item was handed over
    cancelled: 1, // Deal cancelled
  };

  const notifications = [
    {
      id: 1,
      icon: 'chatbubble-ellipses-outline',
      title: 'You have 2 new messages',
      desc: 'Phuc and An just messaged you about your laptop listing.',
      time: '2 hours ago',
    },
    {
      id: 2,
      icon: 'heart-outline',
      title: 'Someone liked your post',
      desc: 'Ngoc liked your listing “Old Nike Sneakers”.',
      time: '5 hours ago',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      icon: 'checkmark-done-circle-outline',
      title: 'You marked “Wooden Study Desk” as sold',
      desc: 'The item is now marked as completed.',
      time: '1 day ago',
    },
    {
      id: 2,
      icon: 'add-circle-outline',
      title: 'You listed a new item',
      desc: '“Mini printer for students.” is now visible to others.',
      time: '3 days ago',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* 🔹 Exchange Status */}
      <View style={styles.orderStatusContainer}>
        <View style={styles.orderRow}>
          <TouchableOpacity
            style={styles.statusItem}
            onPress={() =>
              navigation.navigate('Orders', { defaultTab: 'requested' })
            }
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="cart-outline" size={22} color="#000" />
              {orderCounts.requested > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{orderCounts.requested}</Text>
                </View>
              )}
            </View>
            <Text style={styles.statusLabel}>Requested</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statusItem}
            onPress={() =>
              navigation.navigate('Orders', { defaultTab: 'meeting' })
            }
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="people-outline" size={22} color="#000" />
              {orderCounts.meeting > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{orderCounts.meeting}</Text>
                </View>
              )}
            </View>
            <Text style={styles.statusLabel}>Meeting</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statusItem}
            onPress={() =>
              navigation.navigate('Orders', { defaultTab: 'completed' })
            }
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#000"
              />
              {orderCounts.completed > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{orderCounts.completed}</Text>
                </View>
              )}
            </View>
            <Text style={styles.statusLabel}>Completed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statusItem}
            onPress={() =>
              navigation.navigate('Orders', { defaultTab: 'cancelled' })
            }
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="close-circle-outline" size={22} color="#000" />
              {orderCounts.cancelled > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{orderCounts.cancelled}</Text>
                </View>
              )}
            </View>
            <Text style={styles.statusLabel}>Cancelled</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.viewOrderBtn}>
          <Text style={styles.viewOrderText}>View My Exchanges</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {notifications.map(n => (
            <View key={n.id} style={styles.card}>
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
            </View>
          ))}
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>

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
    paddingTop: 50,
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
});
