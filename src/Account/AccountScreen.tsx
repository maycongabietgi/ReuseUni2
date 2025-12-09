import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type AccountNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Account'
>;

type Props = {
  navigation: AccountNavigationProp;
};
export type AddressType = {
  id?: number;
  name: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  address: string;
  isPrimary: boolean;
  tag?: string;
};

const addresses: AddressType[] = [
  {
    id: 1,
    name: 'Nguyen Van A',
    phone: '0909 123 456',
    city: 'Ho Chi Minh City',
    district: 'Thu Duc City',
    ward: 'Linh Trung Ward',
    address: 'Dormitory Zone B, Building BA3, Room 312',
    isPrimary: true,
    tag: 'Default',
  },
  {
    id: 2,
    name: 'Tran Thi B',
    phone: '0912 456 789',
    city: 'Ho Chi Minh City',
    district: 'Thu Duc City',
    ward: 'Dong Hoa Ward',
    address: 'Opposite BK Coffee, VNU Village',
    isPrimary: false,
    tag: 'Pickup',
  },
  {
    id: 3,
    name: 'Le Minh C',
    phone: '0934 567 890',
    city: 'Ho Chi Minh City',
    district: 'Thu Duc City',
    ward: 'Linh Trung Ward',
    address: 'Dormitory Zone A, Building AH, Room 204',
    isPrimary: false,
  },
];

export default function AccountScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('SideBar')}>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <Ionicons name="settings-outline" size={22} color="#000" />
      </View>

      {/* Account Section */}
      <Text style={styles.sectionTitle}>Account</Text>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Quinn Briar</Text>
          <Text style={styles.profilePhone}>+65 9886 6893</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="create-outline" size={14} color="#fff" />
            <Text style={styles.profileButtonText}> Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Section */}
      <View style={styles.addressHeader}>
        <Text style={styles.sectionTitle}>My addresses</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditAddress', {})}
        >
          <Ionicons name="add-circle-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {addresses.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.addressCard}
          onPress={() => navigation.navigate('EditAddress', { address: item })}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="home-outline" size={24} color="#000" />
          </View>
          <View style={styles.addressRow}>
            <View>
              <Text style={styles.addressName}>{item.name}</Text>
              <Text style={styles.addressPhone}>{item.phone}</Text>
              <Text style={styles.addressText}>
                {`${item.address}, ${item.ward}, ${item.district}, ${item.city}`}
              </Text>
            </View>
          </View>
          {item.tag && (
            <View
              style={[
                styles.tag,
                item.tag === 'Default' ? styles.defaultTag : styles.pickupTag,
              ]}
            >
              <Text
                style={[
                  item.tag === 'Default'
                    ? styles.defaultTagText
                    : styles.pickupTagText,
                ]}
              >
                {item.tag}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  profileInfo: { marginLeft: 15 },
  profileName: { fontSize: 18, fontWeight: '600' },
  profilePhone: { fontSize: 14, color: '#666', marginVertical: 4 },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D7FF9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  profileButtonText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  addressRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addressName: { fontSize: 16, fontWeight: '600' },
  addressPhone: { fontSize: 14, color: '#666', marginVertical: 2 },
  addressText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 18,
    flexShrink: 1,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    width: 70,
    flexShrink: 0,
    alignSelf: 'center',
  },
  defaultTag: { borderColor: '#F94D4D' },
  defaultTagText: { color: '#F94D4D' },
  pickupTag: { borderColor: '#BDBDBD' },
  pickupTagText: { color: '#555' },
});
