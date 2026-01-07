// LoginScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { styles } from './LoginScreen.styles';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Prompt } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  /**
   * 🔐 Google Auth Request
   * - Dùng WEB client ID (bắt buộc với Expo Go)
   * - Ép Google luôn hiện chọn tài khoản
   */
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      '623155416750-4qp5c1h30u3t2jqoooam2tkcdgpetedo.apps.googleusercontent.com',

    // Cờ chuẩn của expo-auth-session
    prompt: Prompt.SelectAccount,

    // 🔥 Cái này mới là thứ Google CHẮC CHẮN đọc
    extraParams: {
      prompt: 'select_account',
      access_type: 'offline',
      include_granted_scopes: 'true',
    },
  });

  /**
   * 🧹 Xóa token cũ mỗi lần vào màn Login
   * (để test login lại từ đầu)
   */
  useEffect(() => {
    const clearOldToken = async () => {
      await AsyncStorage.removeItem('userToken');
      console.log('🧹 Đã xoá token cũ');
    };
    clearOldToken();
  }, []);

  /**
   * 🎯 Xử lý kết quả đăng nhập Google
   */
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      console.log('✅ Google login thành công');
      console.log('🔥 ACCESS TOKEN:', authentication?.accessToken);
      console.log('🆔 ID TOKEN:', authentication?.idToken);

      if (authentication?.accessToken) {
        AsyncStorage.setItem('userToken', authentication.accessToken);
        navigation.replace('Home');
      } else {
        Alert.alert('Lỗi', 'Không lấy được access token từ Google');
      }
    }

    if (response?.type === 'error') {
      console.log('❌ Google Auth error:', response);
      Alert.alert('Lỗi', 'Đăng nhập Google thất bại');
    }
  }, [response, navigation]);

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      {/* Image */}
      <Image
        source={require('../assets/img_waiting2.png')}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>
        Immerse in a seamless online {'\n'} shopping experience.
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        We promise that you’ll have the {'\n'} most fuss-free time with us ever.
      </Text>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, !request && styles.buttonDisabled]}
        disabled={!request}
        onPress={() =>
          promptAsync({
          })
        }
      >
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
