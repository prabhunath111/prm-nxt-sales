/**
 * Root component for the mobile application.
 * This component acts as the entry point for the app and wraps the entire
 * application with context providers and suspense for code splitting.
 *
 * @module components/App
 * @component
 *
 * @returns {JSX.Element} The rendered App component.
 */
import React, { Suspense, useEffect, useState } from 'react';
import ProviderContainer from 'wrappers/container/ProviderContainer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from 'app/App.styles';
import { Alert, AppLoader, BottomModal, MoengageNotifications, Text } from 'components/sales';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Routes from 'navigation/routes';
import NetworkStatus from 'wrappers/network/NetworkStatus';
import JailMonkey from 'jail-monkey';
import { View, AppState, StyleSheet } from 'react-native';

import env from 'config/env';
import { Colors } from 'styles';
import { ICONS } from 'const';
import { Image } from 'components/sales';

/**
 * App component renders the main structure of the application.
 * It wraps the entire application with context providers and suspense
 * for code-splitting.
 *
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
  const [isSecure, setIsSecure] = useState(true);

  const [isBackgrounded, setIsBackgrounded] = useState(false);

  useEffect(() => {
    const checkSecurity = async () => {
      const isJailbroken = JailMonkey.isJailBroken();
      const canMockLocation = JailMonkey.canMockLocation();
      const hookDetected = JailMonkey.hookDetected?.() ?? false;

      const isDevelopmentSettingsEnabled = await JailMonkey.isDevelopmentSettingsMode();

      // Critical checks
      if (isJailbroken || canMockLocation || hookDetected) {
        setIsSecure(false);
        return;
      }

      // Production-only check
      if (env.ENVIRONMENT === 'production' && isDevelopmentSettingsEnabled) {
        setIsSecure(false);
      }
    };

    checkSecurity();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // Set backgrounded to true if app is not active (e.g. background, inactive/task switcher)
      setIsBackgrounded(nextAppState !== 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!isSecure) {
    return (
      <Suspense fallback={<View />}>
        <View style={styles.secureContainer}>
          <View style={styles.secureCard}>
            <Text style={styles.secureTitle}>Security Alert</Text>
            <Text style={styles.secureMessage}>
              This application is restricted for security reasons. Rooted devices and Developer Settings (on Production builds) are blocked. Please use a secure device to continue.
            </Text>
          </View>
        </View>
      </Suspense>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProviderContainer>
        <SafeAreaProvider>
          <Suspense fallback={<AppLoader message="loading" />}>
            <SafeAreaView edges={['bottom']} style={styles.container}>
              <MoengageNotifications />
              <NetworkStatus />
              <Alert />
              <BottomModal />
              <AppLoader />
              <Routes />
              {isBackgrounded && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.violet.v500, justifyContent: 'center', alignItems: 'center', zIndex: 9999 }]}>
                  <Image iconName={ICONS.LOGO_NEW} style={{ width: 200, height: 100 }} />
                </View>
              )}
            </SafeAreaView>
          </Suspense>
        </SafeAreaProvider>
      </ProviderContainer>
    </GestureHandlerRootView>
  );
};

export default App;
