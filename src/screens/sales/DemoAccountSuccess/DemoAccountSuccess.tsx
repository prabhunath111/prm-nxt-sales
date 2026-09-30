/**
 * Success screen for demo account creation
 *
 * @module components/DemoAccountSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, CommonSuccess, CustomerDetailsCard, Text } from 'components/sales';
import { ICONS, STYLES } from 'const';
import { Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import styles from './DemoAccountSuccess.styles';

/**
 * Represents a DemoAccountSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const DemoAccountSuccess = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const { demoAccountSuccessData, selectedBox } = useSelector((state: RootState) => state.demoAccount);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { goHome } = useNavigate();

  return (
    <View style={[styles.mainContainer, styles[gcs('mainContainer', inflection, true, ['md', 'lg', 'xl'])]]} testID="demoAccountTest">
      <View style={[styles.cardDetailsContainer, styles[gcs('cardDetailsContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CustomerDetailsCard />
      </View>
      <ScrollView contentContainerStyle={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CommonSuccess primaryText={demoAccountSuccessData?.message} hasDefaultHeader />
        <View style={[styles.invoiceContainer, styles[gcs('invoiceContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <View style={styles.partnerNameContainer}>
            <Text style={styles.primaryTextStyle} label={t('strings.woNumber')} />
            <Text style={styles.mediumTextStyle} label={demoAccountSuccessData?.woNumber} />
          </View>
          <View style={styles.boxPriceContainer}>
            <Text style={styles.primaryTextStyle} label={t('strings.addBoxPrice')} />
            <Text style={styles.mediumTextStyle} label={selectedBox} />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          iconName={ICONS.HOME}
          fontSize={Sizing.layout.x16}
          iconHeight={Sizing.layout.x15}
          iconWidth={Sizing.layout.x15}
          iconPosition={STYLES.POSITION.LEFT}
          label={t('strings.backToHome')}
          isDimension={false}
          onPress={() => goHome(isRedirection)}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(DemoAccountSuccess);
