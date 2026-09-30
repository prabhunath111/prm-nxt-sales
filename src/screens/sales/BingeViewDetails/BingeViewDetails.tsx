/**
 * Details screen for binge offer plan.
 *
 * @module components/BingeViewDetails
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Image, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { ICONS, PROPERTIES } from 'const';
import { Sizing } from 'styles';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import styles from './BingeViewDetails.styles';

/**
 * Represents a BingeViewDetails component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const BingeViewDetails = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const { selectedOffer } = useSelector((state: RootState) => state.customerOffers);
  const iconArr = PROPERTIES.BINGE_VIEW_DETAILS.ICON_ARR;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
        <View style={[styles.topContainer, styles[gcs('topContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Text label={t('strings.bingeFlexiLite')} style={styles.headingTextStyle} />
          <Text label={t('strings.enjoyOttOfChoice')} style={styles.primaryTextStyle} />
          <View style={styles.rowContainer}>
            {iconArr.map((item, idx) => (
              <>
                <View style={styles.columnContainer}>
                  <View style={styles.circularIconContainer}>
                    <Image iconName={item.icon} style={styles.iconStyle} isDimension={false} />
                  </View>
                  <Text label={t(`strings.${item.text}`)} style={styles.secondaryTextStyle} />
                </View>
                {idx < iconArr.length - Sizing.layout.x1 ? <Image iconName={ICONS.GREY_CHEVRON_RIGHT} style={styles.chevronIconStyle} isDimension={false} /> : null}
              </>
            ))}
          </View>
          <View style={styles.textContainer}>
            <Text label={t('strings.appLinkSharing')} style={[styles.lightTextStyle, styles[gcs('lightTextStyle', inflection, true, ['md', 'lg', 'xl'])]]} />
          </View>
          <View style={styles.rowTextContainer}>
            <View style={styles.rowTextContainer}>
              <Text label={t('strings.four')} style={styles.largeTextStyle} />
              <Text label={t('strings.devicesAtTime')} style={styles.greyTextStyle} />
            </View>
            <View style={styles.verticalSeparator} />
            <View style={styles.rowTextContainer}>
              <Image iconName={ICONS.DEVICES} width={Sizing.layout.x35} height={Sizing.layout.x11} isDimension={false} />
              <Text label={t('strings.watchOnTV')} style={styles.greyTextStyle} />
            </View>
          </View>
        </View>
        <View style={[styles.bottomContainer, styles[gcs('imagesContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Text label={t('strings.wideRangeApps')} style={styles.primaryTextStyle} />
          <View style={[styles.imagesContainer, styles[gcs('imagesContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            {selectedOffer?.imageArray?.map((item: { id: string; iconName: string }) => (
              <Image
                key={item.id}
                iconName={item.iconName}
                isDimension={false}
                isLocal={false}
                style={StyleSheet.flatten([styles.imageStyle, styles[gcs('imageStyle', inflection, true, ['md', 'lg', 'xl'])]])}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button label={t('strings.add')} onPress={() => {}} />
      </View>
    </View>
  );
};

export default memo(BingeViewDetails);
