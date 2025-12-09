import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradientMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topGradient: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    transform: [{ rotate: '45deg' }],
  },
  bottomGradient: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 200,
    height: 200,
    transform: [{ rotate: '45deg' }],
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
