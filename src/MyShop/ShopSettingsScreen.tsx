import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type ShopSettingsNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'ShopSettings'
>;
type Props = {
  navigation: ShopSettingsNavProp;
};

export default function ShopSettingsScreen({ navigation }: Props) {
  const [shopName, setShopName] = useState('Nike Official');
  const [description, setDescription] = useState(
    'Best quality sneakers & sportswear.',
  );
  const [avatar, setAvatar] = useState<string | null>(
    'https://i.imgur.com/ZcLLrkY.png',
  );
  const [address, setAddress] = useState('Hanoi, Vietnam');

  const handlePickAvatar = () => {
    // 🧠 Giả lập thay ảnh đại diện (sau này sẽ gọi API upload)
    setAvatar('https://i.imgur.com/w1Jr0cD.png');
  };

  const handleSave = () => {
    console.log({ shopName, description, address, avatar });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Settings</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarBox}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="image-outline" size={30} color="#9ca3af" />
                <Text style={styles.avatarText}>Add Avatar</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* 🔄 Nút đổi avatar */}
          <TouchableOpacity onPress={handlePickAvatar} style={styles.changeBtn}>
            <Ionicons name="camera-outline" size={16} color="#2D7FF9" />
            <Text style={styles.changeText}>Change Avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Shop Name */}
        <Text style={styles.label}>Shop Name</Text>
        <TextInput
          value={shopName}
          onChangeText={setShopName}
          placeholder="Enter shop name"
          style={styles.input}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your shop"
          multiline
          numberOfLines={3}
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        />

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter shop address"
          style={styles.input}
        />

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#2D7FF9', '#4C9BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveBtn}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },

  /* Avatar */
  avatarContainer: { alignItems: 'center', marginVertical: 20 },
  avatarBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: { alignItems: 'center' },
  avatarText: { fontSize: 12, color: '#9ca3af', marginTop: 4 },

  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#E8F1FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeText: {
    color: '#2D7FF9',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },

  /* Form */
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },

  /* Button */
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    marginVertical: 10,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
