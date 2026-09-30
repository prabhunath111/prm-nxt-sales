/**
 * this component is used to create a pincode purple card
 *
 * @module components/PincodeDetailsCard
 * @memberof CommonComponent
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import Image from 'components/sales/Image';
import Text from 'components/sales/Text';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { ICONS, ROUTE } from 'const';
import { Sizing } from 'styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import styles from './PincodeDetailsCard.styles';

/**
 * Component type definitions
 *
 * @typedef {object} PincodeDetailsCardProps
 * @property {string} [text] - The content for the component
 */

export type PincodeDetailsCardProps = {
  queryName?: string;
  routeName?: string;
  label?: string;
  currentRoute?: string;
};

/**
 * Represents a PincodeDetailsCard component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered PincodeDetailsCard component
 *
 * @example
 * <PincodeDetailsCard text="Hello World!" />
 */

const PincodeDetailsCard = ({ queryName, routeName, label, currentRoute = '' }: PincodeDetailsCardProps) => {
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { etskPincode } = useSelector((state: RootState) => state.quotation);
  const finalLabel = label?.trim() ? label : 'pincode';
  const handleChangeDealer = () => {
    if (routeName) {
      navigate(routeName);
    } else if (queryName) {
      dispatch(callAction({}, queryName));
    }
  };

  return (
    <View style={styles.purpleContainer} testID="PincodeDetailsCard">
      {currentRoute !== ROUTE.WEB.TSK_VOUCHER_DETAILS ? (
        <View>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>{t(`strings.${finalLabel}`)}</Text>
            <Pressable style={styles.headingContainer} onPress={handleChangeDealer}>
              <Image iconName={ICONS.EDIT_PENCIL} height={Sizing.layout.x12} width={Sizing.layout.x12} isDimension={false} />
              <Text style={styles.changeDealer}>{t('strings.change')}</Text>
            </Pressable>
          </View>
          <View style={styles.dealerDetailsContainer}>
            <Text style={styles.secondaryCount}>{etskPincode}</Text>
          </View>
        </View>
      ) : null}

      {currentRoute === ROUTE.WEB.TSK_VOUCHER_DETAILS ? (
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>{t(`strings.${finalLabel}`)}</Text>
          <View style={styles.dealerDetailsContainer}>
            <Text style={styles.secondaryCount}>{etskPincode}</Text>
          </View>
          <Pressable style={styles.headingContainer} onPress={handleChangeDealer}>
            <Image iconName={ICONS.EDIT_PENCIL} height={Sizing.layout.x12} width={Sizing.layout.x12} isDimension={false} />
            <Text style={styles.changeDealer}>{t('strings.change')}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default PincodeDetailsCard;
