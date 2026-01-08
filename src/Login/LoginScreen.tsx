// LoginScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const handleStart = () => {
    navigation.replace('Home');
  };

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

      {/* NÚT START */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleStart}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Start</Text>
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
    backgroundColor: '#4D5BFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
