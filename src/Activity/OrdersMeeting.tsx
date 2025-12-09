import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function OrdersMeeting() {
  const currentUser = 'Phuc Nguyen';
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const cancellationReasons = [
    'Found another item nearby',
    'Changed my mind',
    'Seller is not responding',
    'Price not suitable anymore',
  ];

  const meetings = [
    {
      id: 1,
      product: {
        name: 'Xiaomi Mi Mix 3',
        price: 160,
        image: {
          uri: 'https://360view.3dmodels.org/zoom/Xiaomi/Xiaomi_Mi_Mix_3_Jade_Green_1000_0001.jpg',
        },
      },
      seller: 'Phuc Nguyen',
      buyer: 'An Tran',
      status: 'meeting',
      note: 'Meet near BK Coffee today.',
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
      status: 'waiting',
      note: 'Waiting for seller to confirm.',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {meetings.map(m => {
          const isSeller = m.seller === currentUser;
          const roleLabel = isSeller
            ? `You’re selling to ${m.buyer}`
            : `You’re buying from ${m.seller}`;

          const statusLabel =
            m.status === 'meeting'
              ? 'Waiting to meet up'
              : m.status === 'completed'
                ? 'Completed'
                : 'Pending confirmation';

          const statusColor =
            m.status === 'completed'
              ? '#2ECC71'
              : m.status === 'meeting'
                ? '#4C69FF'
                : '#F1C40F';

          const statusIcon =
            m.status === 'completed'
              ? 'checkmark-done-outline'
              : m.status === 'meeting'
                ? 'people-outline'
                : 'hourglass-outline';

          return (
            <View key={m.id} style={styles.meetingCard}>
              <Text style={styles.meetingId}>Meeting #{m.id}</Text>

              {/* Product info */}
              <View style={styles.row}>
                <Image source={m.product.image} style={styles.image} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{m.product.name}</Text>
                  <Text style={styles.price}>${m.product.price}</Text>
                  <Text style={styles.role}>{roleLabel}</Text>
                </View>
              </View>

              {/* Info box */}
              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Ionicons
                    name={statusIcon}
                    size={18}
                    color={statusColor}
                    style={styles.icon}
                  />
                  <Text style={[styles.infoText, { color: statusColor }]}>
                    {statusLabel}
                  </Text>
                </View>

                {m.note && (
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color="#4C69FF"
                      style={styles.icon}
                    />
                    <Text style={[styles.infoText, { fontStyle: 'italic' }]}>
                      “{m.note}”
                    </Text>
                  </View>
                )}
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

                {isSeller ? (
                  <TouchableOpacity style={styles.gradientWrapper}>
                    <LinearGradient
                      colors={['#5565FB', '#5599FB']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.9, y: 0.8 }}
                      style={styles.gradientBtn}
                    >
                      <Text style={styles.gradientText}>Mark as Done</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.gradientWrapper}
                    onPress={() => setShowCancelModal(true)}
                  >
                    <LinearGradient
                      colors={['#FF4C96', '#FF6FB5']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.9, y: 0.8 }}
                      style={styles.gradientBtn}
                    >
                      <Text style={styles.gradientText}>Decline</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* 🔽 Cancellation Modal */}
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
            <Text style={styles.modalTitle}>Cancellation Reasons</Text>

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

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setShowCancelModal(false)}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  meetingCard: {
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
  meetingId: {
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
  },
  name: { fontSize: 15, fontWeight: '600', color: '#000' },
  price: { color: '#4C69FF', fontWeight: '600', marginTop: 2 },
  role: { color: '#555', fontSize: 13, marginTop: 4 },

  infoBox: {
    backgroundColor: '#F7F8FF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  icon: { marginRight: 6 },
  infoText: { color: '#333', fontSize: 13, fontWeight: '500' },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
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
  gradientWrapper: { borderRadius: 8, overflow: 'hidden' },
  gradientBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  gradientText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  /* 🔽 Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, alignItems: 'center', textAlign: 'center' },
  reasonItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  reasonSelected: {
    backgroundColor: '#F2F4FF',
  },
  reasonText: { fontSize: 14, color: '#333' },
  backBtn: {
    borderWidth: 1,
    borderColor: '#4C69FF',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  backText: { color: '#4C69FF', fontWeight: '600', fontSize: 15 },
});
