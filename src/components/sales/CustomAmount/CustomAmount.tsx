/**
 * A component that allows users to select a predefined amount type or enter a custom amount value.
 * It displays the user's wallet balance, offers radio buttons for predefined amount types,
 * and allows manual input for custom amounts.
 *
 * @module components/CustomAmount
 * @memberof CommonComponent
 */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Text from 'components/sales/Text';
import { formatValue } from 'utils/responseHelper';
import { ICONS, PROPERTIES, STYLE_VARIANT, VALUE_TYPE } from 'const';
import { Colors, Sizing } from 'styles';
import Radio from 'components/sales/Radio';
import IconTextInput from 'components/sales/IconTextInput';
import Image from 'components/sales/Image';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import styles from './CustomAmount.styles';

/**
 * User object type definition
 *
 * @typedef {object} User
 * @property {string} name - The name of the user
 * @property {string} walletBalance - The user's wallet balance
 */
interface User {
  name: string;
  walletBalance: string;
}

/**
 * Props for the CustomAmount component
 *
 * @typedef {object} CustomAmountProps
 * @property {User} [userDetails] - Details about the user, including their name and wallet balance
 * @property {string} [headerLabel] - Optional label displayed above the amount options
 * @property {OnAmountChange} onAmountChange - Callback function invoked when the amount is changed
 */

export type CustomAmountProps = {
  userDetails?: User;
  headerLabel?: string;
  radioTextArr: string[];
  onAmountChange: (newAmt: string | number) => void;
};

/**
 * CustomAmount Component
 *
 * @param {CustomAmountProps} props - The properties passed to the CustomAmount component
 * @returns {JSX.Element} The rendered CustomAmount component
 *
 * @example
 * <CustomAmount
 *   userDetails={{ name: 'John', walletBalance: '1000' }}
 *   onAmountChange={(newAmt) => console.log(newAmt)}
 *   headerLabel="Select an Amount"
 * />
 */

const CustomAmount = ({ userDetails, radioTextArr, onAmountChange, headerLabel }: CustomAmountProps) => {
  const [selectedRadio, setSelectedRadio] = useState('');
  const { t } = useTranslation();
  const { customAmount } = useSelector((state: RootState) => state.common);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!customAmount) {
      setAmount('');
    }
    if (!userDetails) {
      return;
    }
    if (selectedRadio === PROPERTIES.EVD_TRANSFER.fullAmount) onAmountChange(customAmount);
    else onAmountChange(amount);
  }, [selectedRadio, amount, customAmount]);

  const handleAmountChange = (newAmt: string) => {
    setSelectedRadio(PROPERTIES.EVD_TRANSFER.customAmount);
    setAmount(newAmt);
  };

  return (
    <View style={styles.container}>
      {userDetails?.name && customAmount ? (
        <View style={styles.balanceContainer}>
          <Text label={`${userDetails.name}'s ${t('strings.walletBalance')}`} />
          <Text label={formatValue(VALUE_TYPE.AMOUNT, customAmount)} />
        </View>
      ) : null}

      <View style={styles.partnerContainer}>
        {headerLabel ? <Text style={styles.selectPartnerLabel} label={headerLabel} required /> : null}
        <View>
          <Radio
            text={radioTextArr[0]}
            showStatus={false}
            isSelected={selectedRadio === PROPERTIES.EVD_TRANSFER.fullAmount}
            onPress={() => setSelectedRadio(PROPERTIES.EVD_TRANSFER.fullAmount)}
            styleVariant={STYLE_VARIANT.P2}
            containerStyle={styles.radioContainerStyle}
          />
          {customAmount ? (
            <View style={styles.amountTextContainer}>
              <Image iconName={ICONS.RUPEE_SYMBOL} width={Sizing.layout.x20} height={Sizing.layout.x20} isDimension={false} />
              <Text style={styles.lightTextStyle} label={customAmount} />
            </View>
          ) : null}
        </View>
        <View style={styles.columnContainer}>
          <Radio
            text={radioTextArr[1]}
            showStatus={false}
            isSelected={selectedRadio === PROPERTIES.EVD_TRANSFER.customAmount}
            onPress={() => setSelectedRadio(PROPERTIES.EVD_TRANSFER.customAmount)}
            styleVariant={STYLE_VARIANT.P2}
            containerStyle={styles.radioContainerStyle}
          />
          <IconTextInput
            value={amount}
            onInputChange={handleAmountChange}
            leftIconName={ICONS.RUPEE_SYMBOL}
            placeholder={t('strings.enterAmount')}
            placeholderTextColor={Colors.violet.v200}
            containerStyle={styles.amountContainerStyle}
            isNumericKeyboard
            isNumericValue
          />
        </View>
      </View>
    </View>
  );
};

export default CustomAmount;
