/**
 * This screen will show all the notifications list
 *
 * @module components/Notifications
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View } from 'react-native';
import Moengage from '@moengage/web-sdk';
import styles from './Notifications.styles';

/**
 * Represents a Notifications component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const Notifications = () => {
  Moengage.onsite.getSelfHandledOSM(() => {
    // Proceed with custom UI rendering and event tracking.
  });

  return <View style={styles.container} testID="notification-test" />;
};

export default memo(Notifications);
