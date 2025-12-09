import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import ProductsTab from './ProductsTab';
import ProfileTab from './ProfileTab';

type MyShopNavProp = NativeStackNavigationProp<RootStackParamList, 'MyShop'>;
type Props = { navigation: MyShopNavProp };

export default function MyShopScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'products' | 'profile'>(
    'products',
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          {/* 🔍 Search */}
          <TouchableOpacity>
            <Ionicons name="search-outline" size={22} color="#000" />
          </TouchableOpacity>

          {/* 📩 Inbox */}
          <TouchableOpacity
            style={{ marginLeft: 14 }}
          >
            <Ionicons name="mail-outline" size={22} color="#000" />
          </TouchableOpacity>

          {/* ⚙️ Settings */}
          <TouchableOpacity
            style={{ marginLeft: 14 }}
            onPress={() => navigation.navigate('ShopSettings')}
          >
            <Ionicons name="settings-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Shop Info */}
      <View style={styles.shopInfo}>
        <Image
          source={{ uri: 'https://i.imgur.com/ZcLLrkY.png' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.shopName}>Nike Official</Text>
          <Text style={styles.shopDesc}>
            Best quality sneakers & sportswear.
          </Text>
        </View>
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
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'products' ? (
        <ProductsTab navigation={navigation} />
      ) : (
        <ProfileTab />
      )}
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '600' },

  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: { width: 50, height: 50, borderRadius: 12, marginRight: 12 },
  shopName: { fontSize: 17, fontWeight: '600' },
  shopDesc: { fontSize: 13, color: '#777' },

  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabText: { color: '#777', fontSize: 15 },
  activeTab: { borderBottomWidth: 2, borderColor: '#2D7FF9' },
  activeTabText: { color: '#2D7FF9', fontWeight: '600' },
});
