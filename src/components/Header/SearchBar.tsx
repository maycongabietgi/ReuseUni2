import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './SearchBar.styles';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
    </View>
  );
}
