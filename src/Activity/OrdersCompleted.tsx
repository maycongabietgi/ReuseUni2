import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type OrdersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Orders'
>;

type Props = {
  navigation: OrdersScreenNavigationProp;
};
export default function OrdersCompleted({ navigation }: Props) {
  const currentUser = 'Phuc Nguyen';

  const completedTrades = [
    {
      id: 1,
      product: {
        name: 'Logitech G703 Wireless Gaming Mouse',
        price: 100,
        image: {
          uri: 'https://app.contabilium.com/files/explorer/16277/Productos-Servicios/concepto-5908504.jpg',
        },
      },
      seller: 'Phuc Nguyen',
      buyer: 'An Tran',
      status: 'completed',
      date: '2 days ago',
    },
    {
      id: 2,
      product: {
        name: 'Mini Desk Lamp',
        price: 15,
        image: {
          uri: 'https://i.pinimg.com/originals/47/c8/f9/47c8f9acd270173663457fd4777804b7.jpg',
        },
      },
      seller: 'Minh Pham',
      buyer: 'Phuc Nguyen',
      status: 'completed',
      date: '1 week ago',
    },
  ];



  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {completedTrades.map(item => {
        const isSeller = item.seller === currentUser;
        const roleLabel = isSeller
          ? `You sold to ${item.buyer}`
          : `You bought from ${item.seller}`;

        return (
          <View key={item.id} style={styles.tradeCard}>
            <Text style={styles.tradeId}>Trade #{item.id}</Text>

            {/* Product Info */}
            <View style={styles.row}>
              <Image source={item.product.image} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.product.name}</Text>
                <Text style={styles.price}>${item.product.price}</Text>
                <Text style={styles.role}>{roleLabel}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>

            {/* Status */}
            <View style={styles.statusRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#2ECC71"
              />
              <Text style={styles.statusText}>Completed</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.chatBtn}>
                <Ionicons
                  name="chatbubble-outline"
                  size={16}
                  color="#4C69FF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.chatText}>Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reviewWrapper}
                onPress={() =>
                  navigation.navigate('Review', { tradeId: item.id })
                }
              >
                <LinearGradient
                  colors={['#5565FB', '#5599FB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.9, y: 0.8 }}
                  style={styles.reviewBtn}
                >
                  <Text style={styles.reviewText}>Review</Text>
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
  tradeCard: {
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
  tradeId: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  row: { flexDirection: 'row', marginBottom: 16 },
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
  date: { color: '#999', fontSize: 12, marginTop: 2, fontStyle: 'italic' },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F9EE',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusText: {
    color: '#2ECC71',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 13,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  reviewWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4C69FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  chatText: { color: '#4C69FF', fontWeight: '600', fontSize: 14 },

  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  reviewText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
