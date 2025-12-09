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
export default function OrdersRequested() {
  const currentUser = 'Phuc Nguyen'; // giả định người đang đăng nhập

  const requests = [
    {
      id: 1,
      product: {
        name: 'Xiaomi Mi Mix 3',
        price: 160,
        color: 'Jade Green',
        image: {
          uri: 'https://360view.3dmodels.org/zoom/Xiaomi/Xiaomi_Mi_Mix_3_Jade_Green_1000_0001.jpg',
        },
      },
      seller: 'Phuc Nguyen',
      buyer: 'An Tran',
      time: 'Requested 2 hours ago',
    },
    {
      id: 2,
      product: {
        name: 'Logitech G703 Wireless Gaming Mouse',
        price: 15,
        color: 'White',
        image: {
          uri: 'https://app.contabilium.com/files/explorer/16277/Productos-Servicios/concepto-5908504.jpg',
        },
      },
      seller: 'Minh Pham',
      buyer: 'Phuc Nguyen',
      time: 'Requested yesterday',
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {requests.map(item => {
        const isSeller = item.seller === currentUser;

        return (
          <View key={item.id} style={styles.requestContainer}>
            <Text style={styles.requestId}>Request #{item.id}</Text>

            {/* Product Card */}
            <View style={styles.productCard}>
              <Image source={item.product.image} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.product.name}</Text>
                <Text style={styles.price}>${item.product.price}</Text>
                <Text style={styles.color}>{item.product.color}</Text>

                <Text style={styles.party}>
                  {isSeller ? `From: ${item.buyer}` : `To: ${item.seller}`}
                </Text>

                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.chatBtn}>
                <Text style={styles.chatText}>Chat</Text>
              </TouchableOpacity>

              {isSeller ? (
                <View style={styles.rightButtons}>
                  <TouchableOpacity style={styles.gradientWrapper}>
                    <LinearGradient
                      colors={['#5565FB', '#5599FB']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.9, y: 0.8 }}
                      style={styles.gradientBtn}
                    >
                      <Text style={styles.gradientText}>Accept</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.gradientWrapper}>
                    <LinearGradient
                      colors={['#FF4C96', '#FF6FB5']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.9, y: 0.8 }}
                      style={styles.gradientBtn}
                    >
                      <Text style={styles.gradientText}>Decline</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.gradientWrapper}>
                  <LinearGradient
                    colors={['#FF4C96', '#FF6FB5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.9, y: 0.8 }}
                    style={styles.gradientBtn}
                  >
                    <Text style={styles.gradientText}>Cancel Request</Text>
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

/* 🎨 STYLES */
const styles = StyleSheet.create({
  requestContainer: {
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
  requestId: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    alignSelf: 'center',
  },
  name: { fontSize: 15, fontWeight: '600', color: '#000' },
  price: { color: '#4C69FF', fontWeight: '600', marginTop: 2 },
  color: { color: '#666', fontSize: 13 },
  party: { color: '#444', fontSize: 13, marginTop: 6 },
  time: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },

  /* Actions */
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  chatBtn: {
    borderWidth: 1,
    borderColor: '#4C69FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  chatText: { color: '#4C69FF', fontWeight: '600', fontSize: 14 },

  rightButtons: { flexDirection: 'row', gap: 8 },
  gradientWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 4,
  },

  gradientBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  gradientText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

});
