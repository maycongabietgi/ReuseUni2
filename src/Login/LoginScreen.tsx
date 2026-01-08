import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '48475528916-v4j2qg40mtqlt256iige8pj4nrk0nr9h.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const signIn = async (): Promise<void> => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signIn();

      const { accessToken } = await GoogleSignin.getTokens();
      console.log('Access Token từ Google:', accessToken);

      await callBackend(accessToken);
    } catch (error: any) {
      setLoading(false);

      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Hủy đăng nhập');
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Thông báo', 'Đang đăng nhập, vui lòng đợi');
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Lỗi', 'Google Play Services không khả dụng');
      } else {
        Alert.alert(
          'Lỗi Google',
          error?.message || 'Đăng nhập Google thất bại'
        );
      }
    }
  };

  const callBackend = async (token: string): Promise<void> => {
    try {
      const response = await fetch(
        'https://bkapp-mp8l.onrender.com/auth/social/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: 'google',
            access_token: token,
          }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('Thành công', `Token Django: ${data.key}`);
        // TODO: Lưu data.key (AsyncStorage) + điều hướng màn hình
      } else {
        console.log('Lỗi Backend:', data);
        Alert.alert('Lỗi đăng nhập', JSON.stringify(data));
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi mạng', 'Không kết nối được tới server Django');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Google Login</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button title="Đăng nhập bằng Google" onPress={signIn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen;
