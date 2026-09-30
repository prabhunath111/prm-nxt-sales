/**
 * Component for displaying a loading message during application loading state.
 * @module components/AppLoader
 * @memberof Common Component
 */
import React from 'react';
import { View, Modal } from 'react-native';
import { Sizing } from 'styles';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { ICONS } from 'const';
import Image from 'components/sales/Image';
import Text from 'components/sales/Text';
import styles from './AppLoader.styles';

/**
 * Represents the props for the AppLoader component.
 * @typedef {object} AppLoaderProps
 * @property {string} message - The message to be displayed during loading.
 * @property {object} [style] - Additional styles for the container.
 */
export type AppLoaderProps = {
  message?: string;
  visible?: boolean;
};

/**
 * @component
 * Renders a loading indicator with a customizable message.
 * @param {AppLoaderProps} props - The props for the AppLoader component.
 * @returns {JSX.Element} The rendered component.
 */
const AppLoader = ({ message, visible }: AppLoaderProps) => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const {
    isLoading: reduxLoading,
    loaderInfo: { message: loaderMsg },
  } = useSelector((state: RootState) => state.ui);

  const isVisible = visible !== undefined ? visible : reduxLoading;

  return (
    <View style={styles.container} testID="loader-test">
      <Modal statusBarTranslucent visible={isVisible} transparent>
        <View style={styles.loaderContainer}>
          <View style={[styles.modalContainer, styles[gcs('modalContainer', inflection, true, ['sm', 'xs'])]]}>
            <View style={styles.toastAlertViewStyle}>
              <Image iconName={ICONS.LOADER} height={Sizing.x5} width={Sizing.x5} />
              <Text style={styles.toastLoaderTitle}>{loaderMsg ?? message ?? t('alertMessages.loaderDefaultMsg')}</Text>
              <Text style={styles.toastLoaderInfo}>{t('alertMessages.loaderInfo')}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default AppLoader;
