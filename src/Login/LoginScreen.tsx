import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { styles } from './LoginScreen.styles';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      '924152182485-jcsfkqc0aot6grmb5u2a4ipp2202lovf.apps.googleusercontent.com',
    webClientId:
      '924152182485-jcsfkqc0aot6grmb5u2a4ipp2202lovf.apps.googleusercontent.com',
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      await AsyncStorage.removeItem('userToken');
      console.log('🧹 Đã xoá token cũ');
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      if (authentication?.accessToken) {
        AsyncStorage.setItem('userToken', authentication.accessToken);
        console.log('🔑 Token đã lưu:', authentication.accessToken);
        navigation.replace('Home');
      } else {
        Alert.alert('Lỗi', 'Không lấy được token Google');
      }
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
      />

      <Text style={styles.title}>
        Immerse in a seamless online {'\n'} shopping experience.
      </Text>

      <Text style={styles.subtitle}>
        We promise that you’ll have the {'\n'} most fuss-free time with us ever.
      </Text>

      <TouchableOpacity
        style={styles.button}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
