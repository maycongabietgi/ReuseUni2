import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { styles } from "./WaitingScreen.styles"


type WaitingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Waiting'
>;

type Props = {
  navigation: WaitingScreenNavigationProp;
};

export default function WaitingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <Image
        source={require('../assets/img_waiting1.png')}
        style={styles.image}
      />

      <Text style={styles.title}>
        Wishing for an item but it is{'\n'}too expensive?
      </Text>

      <Text style={styles.subtitle}>
        You will be notified of promotions{'\n'}for products in your wishlist.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login' as any)}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
