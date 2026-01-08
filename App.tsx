// App.tsx (hoặc root file của app)
import React from 'react';
import * as Sentry from '@sentry/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

// App Navigator + navigation integration
import AppNavigator, { navIntegration } from './src/AppNavigator';
// Khởi tạo Sentry (giữ nguyên như bạn có)
Sentry.init({
  dsn: 'https://9e58f8ffc917747b05c7df841283ccc0@o4510505845981184.ingest.us.sentry.io/4510505854238720',
  tracesSampleRate: 1.0,
  debug: __DEV__,

  integrations: [
    navIntegration,

    Sentry.feedbackIntegration({
      isNameRequired: true,
      isEmailRequired: true,
      enableScreenshot: false,

      namePlaceholder: 'Họ và tên',
      emailPlaceholder: 'Email',
      messagePlaceholder: 'Mô tả lỗi bạn gặp phải',

      styles: {
        submitButton: {
          backgroundColor: '#4D5BFF',
        },
      },
    }),
  ],
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