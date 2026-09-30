import React, { ReactNode, JSX } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from 'store';
import ApolloProvider from 'wrappers/apollo/ApolloProvider';
import { NavigationContainer } from '@react-navigation/native';
import ErrorBoundary from 'wrappers/error/ErrorBoundary';
import { navigationRef } from 'utils/navigationHelper';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'config/i18n';
import { AppLoader } from 'components/sales';

/**
 * Props for the ProviderContainer component.
 */
type Props = {
  children: string | JSX.Element | JSX.Element[] | ReactNode;
};

/**
 * ProviderContainer component wraps the children with Redux Provider, ApolloProvider, and NavigationContainer.
 *
 * @component
 * @param {Props} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
const ProviderContainer = ({ children }: Props) => {
  const { t } = useTranslation();
  return (
    <Provider store={store}>
      <ApolloProvider>
        <PersistGate loading={<AppLoader message={t('strings.loading')} />} persistor={persistor}>
          <NavigationContainer ref={navigationRef}>
            <I18nextProvider i18n={i18n}>
              <ErrorBoundary>{children}</ErrorBoundary>
            </I18nextProvider>
          </NavigationContainer>
        </PersistGate>
      </ApolloProvider>
    </Provider>
  );
};

export default ProviderContainer;
