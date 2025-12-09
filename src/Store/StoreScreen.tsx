import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductsTab from './ProductTab';
import StoreProfileTab from './StoreProfileTab';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Store'>;

export default function StoreScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'products' | 'profile'>(
    'products',
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Ionicons name="mail-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Store Info */}
      <View style={styles.storeInfo}>
        <Image
          source={{ uri: 'https://i.imgur.com/ZcLLrkY.png' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.storeName}>Nike Official</Text>
          <Text style={styles.verified}>Verified</Text>
        </View>
        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => setActiveTab('products')}
          style={[styles.tabItem, activeTab === 'products' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'products' && styles.activeTabText,
            ]}
          >
            Products
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('profile')}
          style={[styles.tabItem, activeTab === 'profile' && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'profile' && styles.activeTabText,
            ]}
          >
            Store Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'products' ? <ProductsTab /> : <StoreProfileTab />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
  },
  headerRight: { flexDirection: 'row', gap: 20 },
  storeInfo: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  avatar: { width: 48, height: 48, borderRadius: 13, marginRight: 12 },
  storeName: { fontSize: 18, fontWeight: '600' },
  verified: { color: '#4C69FF', fontSize: 13 },
  followBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#737dacff',
  },
  followText: { color: '#4C69FF', fontWeight: '500' },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabText: { color: '#777', fontSize: 15 },
  activeTab: { borderBottomWidth: 2, borderColor: '#2D7FF9' },
  activeTabText: { color: '#2D7FF9', fontWeight: '600' },
});
