/**
 * This component displays basic customer details in a card format using the provided keys and data from the Redux state.
 *
 * @module components/CustomerDetailsCard
 * @memberof CommonComponent
 */

import React from 'react';
import { Dimensions, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import TextContainer, { itemType } from 'components/sales/TextContainer';
import { PROPERTIES, STATE_KEY } from 'const';
import { ParentObject } from 'store/sales/types/common';
import styles from './CustomerDetailsCard.styles';

/**
 * Component type definitions
 *
 * @typedef {object} CustomerDetailsCardProps
 * @property {itemType[]} [keysToShow] - An array of keys that specify which details to display from the customer data.
 * @property {string} [stateKey] - The key in the Redux state where the customer data is stored, defaulting to form state.
 */

export type CustomerDetailsCardProps = {
  keysToShow?: itemType[];
  stateKey?: string;
  primaryStyle?: object;
  secondaryStyle?: object | ((key: string, value: ParentObject) => object);
};

/**
 * Represents a CustomerDetailsCard component that displays customer details based on the provided keys.
 *
 * @param {CustomerDetailsCardProps} props - React properties passed from composition.
 * @param {itemType[]} [props.keysToShow=PROPERTIES.CUSTOMER_OFFERS.CUSTOMER_DETAILS] - The keys used to extract data fields from the Redux state.
 * @param {string} [props.stateKey=STATE_KEY.FORM_STATE] - The key within the Redux state that holds the customer details.
 * @returns {JSX.Element} The rendered CustomerDetailsCard component.
 *
 * @example
 * // Example usage of CustomerDetailsCard component
 * <CustomerDetailsCard keysToShow={['customerName', 'customerID']} stateKey="CUSTOMER_STATE" />
 */

const CustomerDetailsCard = ({
  keysToShow = PROPERTIES.CUSTOMER_OFFERS.CUSTOMER_DETAILS,
  stateKey = STATE_KEY.FORM_STATE,
  primaryStyle = {},
  secondaryStyle = {},
}: CustomerDetailsCardProps) => {
  const screenWidth = Dimensions.get('window').width;
  const isWeb = screenWidth > 1024;
  const { dealerDetails } = useSelector((state: RootState) => state.form[stateKey]);
  const { isETSK, packDetails } = useSelector((state: RootState) => state.demoAccount);
  const finalKeysToShow = isETSK && isWeb ? PROPERTIES.CUSTOMER_OFFERS.CUSTOMER_DETAILS_ETSK : keysToShow;
  const bookingFormNumber = packDetails?.response?.bookingFormNumber;
  const finalDealerDetails =
    isETSK && isWeb
      ? {
          ...dealerDetails,
          bookingFormNumber,
        }
      : dealerDetails;

  return (
    <>
      <View style={styles.container}>
        <TextContainer
          data={finalDealerDetails}
          dataArray={finalKeysToShow}
          textContainerStyle={styles.textContainerStyle}
          itemContainerStyle={styles.itemContainerStyle}
          primaryStyle={[styles.primaryTextStyle, primaryStyle]}
          secondaryStyle={[styles.secondaryTextStyle, secondaryStyle]}
        />
      </View>
      {!isWeb && isETSK && bookingFormNumber && (
        <View style={styles.etskContainer}>
          <TextContainer
            itemContainerStyle={styles.textWrapperManage}
            data={{ bookingFormNumber }}
            dataArray={PROPERTIES.ETSK_REGISTRATION.BOOKING_FORM_NUMBER}
            hasSepratorBottom
          />
        </View>
      )}
    </>
  );
};

export default CustomerDetailsCard;
