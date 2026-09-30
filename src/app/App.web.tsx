/**
 * Root component for the website.
 * This component serves as the entry point for the website and contains
 * context providers, suspense for code-splitting, and the main routes.
 *
 * @module components/App
 * @component
 *
 * @returns {JSX.Element} The rendered App component.
 */
import React, { Suspense, useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProviderContainer from 'wrappers/container/ProviderContainer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Alert, AppLoader, BottomModal, CustomFallback, MoengageNotifications } from 'components/sales';
import Routes from 'navigation/routes';
import NetworkStatus from 'wrappers/network/NetworkStatus';
import { LOG } from 'config/logger';
import 'assets/css/styles.css';
import styles from './App.styles';

/**
 * App component renders the main structure of the website.
 * It wraps the entire website with context providers and suspense
 * for code-splitting.
 *
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
  const handleUnload = () => {
    // Custom logic to handle when the browser tab is closed
    LOG.info('Browser tab is closing');
    // clearStorage();
  };

  useEffect(() => {
    // Attach the event listener
    window.addEventListener('unload', handleUnload);
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProviderContainer>
        <SafeAreaProvider>
          <Suspense fallback={<CustomFallback />}>
            <SafeAreaView edges={['bottom']} style={styles.container}>
              <MoengageNotifications />
              <NetworkStatus />
              <Alert />
              <BottomModal />
              <AppLoader />
              <Routes />
            </SafeAreaView>
          </Suspense>
        </SafeAreaProvider>
      </ProviderContainer>
    </GestureHandlerRootView>
  );
};
export default App;
