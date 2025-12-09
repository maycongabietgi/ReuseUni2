import React from 'react';
import AppNavigator from './src/AppNavigator';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://9e58f8ffc917747b05c7df841283ccc0@o4510505845981184.ingest.us.sentry.io/4510505854238720',
  tracesSampleRate: 1.0,
});

export default function App() {
  return <AppNavigator />;
}