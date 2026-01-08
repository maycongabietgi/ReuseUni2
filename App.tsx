import React from 'react';
import AppNavigator from './src/AppNavigator';
import * as Sentry from '@sentry/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, StatusBar } from 'react-native';

Sentry.init({
  dsn: 'https://9e58f8ffc917747b05c7df841283ccc0@o4510505845981184.ingest.us.sentry.io/4510505854238720',
  tracesSampleRate: 1.0,
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* SafeAreaView ở đây sẽ bọc toàn bộ App vào vùng an toàn */}
        <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <AppNavigator />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Đặt màu nền trùng với màu chủ đạo của App
  },
});