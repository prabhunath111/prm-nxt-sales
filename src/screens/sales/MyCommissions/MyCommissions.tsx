/**
 * details of my commissions
 *
 * @module components/MyCommissions
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View } from 'react-native';
import { DynamicTable, Gradient, InformationText, Text } from 'components/sales';
import { Colors, Sizing } from 'styles';
import { ALIGNMENT, STRINGS } from 'const';
import { useTranslation } from 'react-i18next';
import { RootState } from 'store';
import { getScreenWidth } from 'styles/dimentionHelper';
import { useSelector } from 'react-redux';
import styles from './MyCommissions.styles';

/**
 * Represents a MyCommissions component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const MyCommissions = () => {
  const { t } = useTranslation();
  const { commissionsData, transactionData } = useSelector((state: RootState) => state.homePage);
  const screenWidth = getScreenWidth();
  const COMMISSIONS_KEY = [
    { accessorKey: STRINGS.MONTH, label: t('strings.months'), size: screenWidth <= Sizing.layout.x500 ? Sizing.layout.x167Dot5 : Sizing.layout.x435, alignment: ALIGNMENT.CENTER },
    {
      accessorKey: STRINGS.COMMISSIONS,
      label: t('strings.commissions'),
      size: screenWidth <= Sizing.layout.x500 ? Sizing.layout.x167Dot5 : Sizing.layout.x435,
      alignment: ALIGNMENT.CENTER,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text label={transactionData?.date} />
        <Gradient colors={Colors.gradient.cardTheme} direction={STRINGS.TO_RIGHT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientStyle}>
          <InformationText
            primaryText={t('strings.totalCommission')}
            primaryStyle={styles.textStyle}
            secondaryStyle={styles.textStyle}
            secondaryText={transactionData?.totalCommissions}
            containerStyle={styles.informationStyle}
          />
        </Gradient>
        <View>
          <DynamicTable columns={COMMISSIONS_KEY} data={commissionsData} />
        </View>
      </View>
    </View>
  );
};

export default memo(MyCommissions);
