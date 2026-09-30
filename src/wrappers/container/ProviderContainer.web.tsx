import React, { ReactNode, JSX } from 'react';
import ApolloProvider from 'wrappers/apollo/ApolloProvider';
import InflectionProvider from 'wrappers/inflection/InflectionProvider';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from 'store';
import ErrorBoundary from 'wrappers/error/ErrorBoundary';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from 'config/i18n';
import { PersistGate } from 'redux-persist/integration/react';
import { AppLoader } from 'components/sales';

/**
 * Props for the ProviderContainer component.
 */
type Props = {
  children: string | JSX.Element | JSX.Element[] | ReactNode;
};

/**
 * ProviderContainer component wraps the children with Redux Provider, ApolloProvider,
 * BrowserRouter, and InflectionProvider.
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
          <BrowserRouter>
            <InflectionProvider>
              <I18nextProvider i18n={i18n}>
                <ErrorBoundary>{children}</ErrorBoundary>
              </I18nextProvider>
            </InflectionProvider>
          </BrowserRouter>
        </PersistGate>
      </ApolloProvider>
    </Provider>
  );
};

export default ProviderContainer;
