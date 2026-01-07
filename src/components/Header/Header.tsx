import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { styles } from './Header.styles';

type JwtPayload = {
  sub?: string;
  email?: string;
  name?: string;
  exp?: number;
};

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token =
        (await AsyncStorage.getItem('userToken')) ?? 'e9d7a608a441910496db97205346aa59963b7d83';

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);

        // Check token expiry
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          await AsyncStorage.removeItem('userToken');
          setIsLoggedIn(false);
          return;
        }

        setUserName(decoded.name || decoded.email || 'User');
        setIsLoggedIn(true);
      } catch (err) {
        console.log('❌ Token không hợp lệ', err);
        await AsyncStorage.removeItem('userToken');
        setIsLoggedIn(false);
      }
    };

    loadUserFromToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReuseUni</Text>

      {isLoggedIn ? (
        <Text style={styles.userText}>👋 Hi, {userName}</Text>
      ) : (
        <Text style={styles.userText}>Chưa đăng nhập</Text>
      )}
    </View>
  );
}
