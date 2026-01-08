// AccountScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import useAuth from '../components/Header/Header';
import { useFocusEffect } from '@react-navigation/native';

type AccountNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account'>;

type Props = {
  navigation: AccountNavigationProp;
};

interface UserProfile {
  id: number;
  email: string;
  username: string;
  first_name: string;
  profile_picture: string;
  name: string;
  address: string;
  rating: number;
  num_reviews: number;
}

export default function AccountScreen({ navigation }: Props) {
  const { token: authToken } = useAuth();
  const insets = useSafeAreaInsets(); // Lấy insets để xử lý safe area

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!authToken) {
      setError('Vui lòng đăng nhập để xem thông tin tài khoản');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://bkapp-mp8l.onrender.com/api/me/', {
        method: 'GET',
        headers: {
          Authorization: `Token ${authToken}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi ${response.status}: Không thể tải thông tin`);
      }

      const data: UserProfile = await response.json();
      setProfile(data);
    } catch (err: any) {
      console.error('Lỗi fetch profile:', err);
      setError(err.message || 'Không thể tải thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [authToken])
  );

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          // logout(); // Nếu useAuth có hàm logout thì gọi ở đây
          // Hoặc thủ công (nếu bạn dùng AsyncStorage lưu token):
          // AsyncStorage.removeItem('token');
          // navigation.replace('Login');
          Alert.alert('Đã đăng xuất', 'Bạn đã thoát khỏi tài khoản.');
          // navigation.replace('Login'); // Chuyển về màn login nếu cần
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <ActivityIndicator size="large" color="#2D7FF9" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View
        style={[
          styles.errorContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Text style={styles.errorText}>{error || 'Không có thông tin tài khoản'}</Text>
        <TouchableOpacity onPress={fetchProfile}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('SideBar')}>
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Tài khoản</Text>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: profile.profile_picture || 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.avatar}
            onError={() => console.log('Lỗi load ảnh profile')}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name || profile.username || 'Người dùng'}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.addressHeader}>
          <Text style={styles.sectionTitle}>Địa chỉ </Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditAddress', {})}>
            <Ionicons name="add-circle-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.addressCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="home-outline" size={24} color="#000" />
          </View>
          <View style={styles.addressRow}>
            <View>
              <Text style={styles.addressName}>{profile.name || 'Người nhận'}</Text>
              <Text style={styles.addressText}>{profile.address || 'Chưa có địa chỉ'}</Text>
            </View>
          </View>
          <View style={[styles.tag, styles.defaultTag]}>
            <Text style={styles.defaultTagText}>Mặc định</Text>
          </View>
        </View>

        {/* Padding bottom để tránh nút logout che nội dung khi cuộn */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Nút Đăng xuất fixed dưới cùng */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          { bottom: insets.bottom + 20 }, // ← Áp dụng insets động ở đây
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 180, // Đủ lớn để tránh nút fixed che nội dung
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F94D4D',
    textAlign: 'center',
  },
  retryText: {
    marginTop: 16,
    color: '#2D7FF9',
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10, // insets.top đã xử lý phần notch/status bar
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
  profileInfo: { marginLeft: 15, flex: 1 },
  profileName: { fontSize: 18, fontWeight: '600' },
  profileEmail: { fontSize: 14, color: '#666', marginVertical: 4 },
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
    marginLeft: 12,
  },
  addressName: { fontSize: 16, fontWeight: '600' },
  addressText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 18,
    marginTop: 4,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    width: 80,
    alignItems: 'center',
    alignSelf: 'center',
  },
  defaultTag: { borderColor: '#F94D4D' },
  defaultTagText: { color: '#F94D4D', fontSize: 12, fontWeight: '500' },

  // Nút logout fixed bottom (không set bottom ở đây)
  logoutButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#F94D4D',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});