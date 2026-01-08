// LoginScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    // ✅ BẮT BUỘC: Web Client ID
    clientId:
      '623155416750-4qp5c1h30u3t2jqoooam2tkcdgpetedo.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      if (authentication?.accessToken) {
        AsyncStorage.setItem('userToken', authentication.accessToken)
          .then(() => navigation.replace('Home'))
          .catch(() =>
            Alert.alert('Lỗi', 'Không thể lưu thông tin đăng nhập')
          );
      } else {
        Alert.alert('Lỗi', 'Không nhận được access token');
      }
    }

    if (response?.type === 'error') {
      Alert.alert(
        'Đăng nhập thất bại',
        response.error?.message || 'Vui lòng thử lại'
      );
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <Image
        source={require('../assets/img_waiting2.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Immerse in a seamless online {'\n'} shopping experience.
      </Text>

      <Text style={styles.subtitle}>
        We promise that you’ll have the {'\n'} most fuss-free time with us ever.
      </Text>

      <TouchableOpacity
        style={[styles.button, !request && styles.buttonDisabled]}
        disabled={!request}
        onPress={() => promptAsync()}
        activeOpacity={0.8}
      >
        <Image
          source={require('../assets/ic_back.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#eee',
  },
  progressFill: {
    width: '40%',
    height: '100%',
    backgroundColor: '#4D5BFF',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 60,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
