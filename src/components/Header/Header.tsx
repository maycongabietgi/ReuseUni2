import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Header.styles';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
    </View>
  );
}
