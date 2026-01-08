// App.tsx (hoặc root file của app)
import React from 'react';
import AppNavigator from './src/AppNavigator';
import * as Sentry from '@sentry/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Khởi tạo Sentry (giữ nguyên như bạn có)
Sentry.init({
  dsn: 'https://9e58f8ffc917747b05c7df841283ccc0@o4510505845981184.ingest.us.sentry.io/4510505854238720',
  tracesSampleRate: 1.0,
  // Nếu muốn debug tốt hơn trong dev, có thể thêm:
  // enableInExpoDevelopment: true,
  // debug: __DEV__,
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}