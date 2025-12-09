import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function OrdersCancelled() {
  const currentUser = 'Phuc Nguyen';

  const cancelledOrders = [
    {
      id: 1,
      product: {
        name: 'Bluetooth Headphones',
        price: 45,
        image: {
          uri: 'https://www.bhphotovideo.com/images/images2500x2500/Beats_900_00009_01_Wireless_Headphones_Black_882187.jpg',
        },
      },
      seller: 'Phuc Nguyen',
      buyer: 'An Tran',
      reason: 'Buyer cancelled the request',
      time: 'Today, 9:00 AM',
    },
    {
      id: 2,
      product: {
        name: 'Desk Organizer',
        price: 10,
        image: {
          uri: 'https://m.media-amazon.com/images/I/91fMVuQYd1L.jpg',
        },
      },
      seller: 'Minh Pham',
      buyer: 'Phuc Nguyen',
      reason: 'Seller declined the offer',
      time: 'Yesterday, 7:45 PM',
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {cancelledOrders.map(order => {
        const isSeller = order.seller === currentUser;
        const roleLabel = isSeller
          ? `You declined ${order.buyer}'s request`
          : `You cancelled your order from ${order.seller}`;

        return (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderId}>Cancelled #{order.id}</Text>

            {/* Product info */}
            <View style={styles.row}>
              <Image source={order.product.image} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{order.product.name}</Text>
                <Text style={styles.price}>${order.product.price}</Text>
                <Text style={styles.role}>{roleLabel}</Text>
                <Text style={styles.reason}>Reason: {order.reason}</Text>
                <Text style={styles.time}>{order.time}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.chatWrapper}>
                <LinearGradient
                  colors={['#5565FB', '#5599FB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.9, y: 0.8 }}
                  style={styles.chatBtn}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.chatText}>Message</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reorderWrapper}>
                <LinearGradient
                  colors={['#FF4C96', '#FF6FB5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.9, y: 0.8 }}
                  style={styles.reorderBtn}
                >
                  <Ionicons
                    name="refresh-outline"
                    size={16}
                    color="#fff"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.reorderText}>Reorder</Text>
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
  orderCard: {
    marginBottom: 28,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E8F0',
  },
  orderId: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  row: { flexDirection: 'row', marginBottom: 10 },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    alignSelf: 'center',
  },
  name: { fontSize: 15, fontWeight: '600', color: '#000' },
  price: { color: '#4C69FF', fontWeight: '600', marginTop: 2 },
  role: { color: '#555', fontSize: 13, marginTop: 4 },
  reason: { color: '#E74C3C', fontSize: 13, marginTop: 4 },
  time: { color: '#999', fontSize: 12, marginTop: 2, fontStyle: 'italic' },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  chatWrapper: { borderRadius: 8, overflow: 'hidden', flex: 1, marginRight: 6 },
  reorderWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
    marginLeft: 6,
  },

  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  chatText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  reorderText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
