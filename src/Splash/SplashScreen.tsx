import React from 'react';
import { Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { styles } from './SplashScreen.styles';

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

export default function SplashScreen({ navigation }: Props) {
  const handlePress = () => {
    navigation.navigate('Waiting');
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      testID="splash-root"
    >
      <LinearGradient
        colors={['#506EFF', '#00FFC7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.linearGradientMain}
      >
        <LinearGradient
          colors={['#30C8BF', '#36DDC4', '#50f6da4c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topGradient}
        />

        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.bottomGradient}
        />

        <Image
          source={require('../assets/ic_reuseuni.png')}
          style={styles.logo}
          testID="splash-logo"
        />
      </LinearGradient>
    </Pressable>
  );
}
