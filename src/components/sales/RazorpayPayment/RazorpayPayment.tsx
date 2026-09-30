/**
 * This is razorpay component and will be used to do payments in msales
 *
 * @module components/RazorpayPayment
 * @memberof CommonComponent
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { Colors } from 'styles';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import uiActions from 'store/sales/actions/ui';
import { ALERT, MODAL } from 'const';
import { useTranslation } from 'react-i18next';
import env from 'config/env';
import styles from './RazorpayPayment.styles';

/**
 * Represents a RazorpayPayment component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered RazorpayPayment component
 *
 * @example
 * <RazorpayPayment text="Hello World!" />
 */

const RazorpayPayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const doPayment = () => {
    // This is dummy options and will be changed when real data comes
    const options = {
      description: 'Credits towards consultation',
      image: 'https://www.tataplay.com/cms-assets/s3fs-public/inline-images/tata-sky-logo.jpg',
      currency: 'INR',
      key: env.RAZORPAY_KEY,
      amount: 5000,
      name: 'Tata Play',
      order_id: '',
      prefill: {
        email: 'jatin.kumar@example.com',
        contact: '9191919191',
        name: 'Jatin Kumar',
      },
      theme: { color: Colors.primary.brand },
    };
    RazorpayCheckout.open(options)
      .then((data: { razorpay_payment_id: string }) => {
        dispatch(uiActions.showAlert(`${t('strings.successPaymentId')} ${data.razorpay_payment_id}`, ALERT.SUCCESS, { primaryText: MODAL.OK }, { data: {} }));
      })
      .catch((error: { code: number; description: string }) => {
        dispatch(uiActions.showAlert(`${t('errors.errorHeader')} ${error.code} | ${error.description}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
      });
  };

  return (
    <View style={styles.container} testID="razorpayTest">
      <TouchableOpacity onPress={() => doPayment()}>
        <Text>{t('strings.doPayment')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RazorpayPayment;
