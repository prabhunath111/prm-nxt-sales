/**
 * This is razorpay component and will be used to do payments in msales
 *
 * @module components/RazorpayPayment
 * @memberof CommonComponent
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from 'styles';
import { AppDispatch } from 'store';
import uiActions from 'store/sales/actions/ui';
import { ALERT, MODAL } from 'const';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { RAZORPAY_LINKS } from 'const/links';
import env from 'config/env';
import styles from './RazorpayPayment.styles';

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  useEffect(() => {
    const script = document.createElement('script');
    script.src = RAZORPAY_LINKS.RAZORPAY_CHECKOUT;
    script.id = 'razorpay-script';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const doPayment = () => {
    if (!window.Razorpay) {
      dispatch(uiActions.showAlert(t('strings.razorpaySdkIsNotLoaded'), ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} }));
      return;
    }
    // This is dummy options and will be changed when real data comes
    const options = {
      key: env.RAZORPAY_KEY,
      amount: '50000',
      currency: 'INR',
      name: 'Tata Play',
      description: 'Test Transaction',
      image: 'https://www.tataplay.com/cms-assets/s3fs-public/inline-images/tata-sky-logo.jpg',
      order_id: '',
      callback_url: RAZORPAY_LINKS.RAZORPAY_CALLBACK_URL,
      prefill: {
        name: 'Jatin Kumar',
        email: 'jatin.kumar@example.com',
        contact: '9000090000',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: Colors.primary.brand,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => doPayment()}>
        <Text>{t('strings.doPayment')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RazorpayPayment;
