import React, { memo, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Accordion, Button, Image, InformationText, Text } from 'components/sales';
import { ICONS, ROUTE, STATE_KEY, STRINGS, STYLES, VALUE_TYPE } from 'const';
import { Colors, Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { SelectedOffer } from 'store/sales/types/customerOffers';
import formAction from 'store/sales/actions/form';
import { formatValue } from 'utils/responseHelper';
import { gcs } from 'styles/webBreakpoints';
import useCurrentRoute from 'hooks/useCurrentRoute';
import styles from './PackViewDetails.styles';

/**
 * Represents a PackViewDetails component.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */

export interface PackViewDetailsProps {
  isPublic?: boolean;
}

const PackViewDetails: React.FC<PackViewDetailsProps> = ({ isPublic = false }) => {
  const { formNavigationData } = useSelector((state: RootState) => state.form[STATE_KEY.FORM_STATE]);
  const { navigationId } = useSelector((state: RootState) => state.customerRecharge);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { goBack } = useNavigate();
  const { isRedirection, navigation } = useSelector((state: RootState) => state.user);
  const { inflection } = useInflection();
  const selectedOfferData: SelectedOffer = formNavigationData?.params;
  const { routeName } = useCurrentRoute();
  const routeDetails = navigation?.routes?.filter((route: any) => route.path === routeName);

  const numberOfItems = useMemo(() => {
    switch (inflection) {
      case BreakPoints.MD:
        return 3;
      case BreakPoints.LG:
        return 6;
      case BreakPoints.XL:
        return 9;
      default:
        return 3;
    }
  }, [inflection]);

  const [expandedChannels, setExpandedChannels] = useState<Record<string, boolean>>({});

  const handleToggleChannelVisibility = (categoryId: string) => {
    setExpandedChannels((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const backHandler = () => {
    if (routeDetails[0].menuName === ROUTE.WEB.CUSTOMER_RECHARGE_VIEW_DETAILS) {
      dispatch(formAction.setFormDependentDefault(navigationId));
    }
    goBack(isRedirection);
  };

  let packName = selectedOfferData.packFriendlyName;
  switch (routeName) {
    case ROUTE.WEB.ETSK_OFFERS_VIEW_DETAILS:
    case ROUTE.WEB.PRIMARY_REG_OFFERS_DETAILS:
    case ROUTE.WEB.RE_PUSH_ORDER_OFFERS_DETAILS:
    case ROUTE.WEB.ETSK_REPUSH_OFFERS_VIEW_DETAILS:
    case ROUTE.WEB.BOX_TYPE_CHANGE_DETAILS:
    case ROUTE.WEB.QUOTATION_ETSK_PACK_DETAILS:
      packName = selectedOfferData.packName;
      break;

    default:
      packName = selectedOfferData.packFriendlyName;
      break;
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainerStyle} style={isPublic ? styles.heightScroll : null}>
        <View style={styles.container}>
          <Text label={packName} style={styles.textStyle} />
          <View style={styles.rowContainer}>
            <InformationText
              primaryText={STRINGS.channelPackPrice}
              secondaryText={formatValue(VALUE_TYPE.AMOUNT, selectedOfferData.packPrice)}
              containerStyle={styles.containerStyle}
            />
            <View style={styles.verticalSeparator} />
            <InformationText primaryText={STRINGS.sdChannels} secondaryText={selectedOfferData.sdCount} containerStyle={styles.containerStyle} />
            <View style={styles.verticalSeparator} />
            <InformationText primaryText={STRINGS.hdChannels} secondaryText={selectedOfferData.hdCount} containerStyle={styles.containerStyle} />
          </View>
        </View>

        <View style={[styles.accordionsContainer, styles[gcs('accordionsContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          {selectedOfferData.bouquetChannels?.map((category) => {
            const allSubChannels = category?.packItems?.flatMap((item) => item?.subChannels || []) || [];
            const totalChannels = allSubChannels.length;
            const isExpanded = expandedChannels[category.id];
            const visibleSubChannels = isExpanded ? allSubChannels : allSubChannels.slice(0, numberOfItems);

            return (
              <Accordion
                key={category.id}
                accordionStyle={styles.accordionStyle}
                buttonStyle={styles.accordionButton}
                collapseIcon={ICONS.PINK_CHEVRON_UP}
                expandIcon={ICONS.PINK_CHEVRON_DOWN}
                isDimension={false}
                iconHeight={Sizing.layout.x20}
                iconWidth={Sizing.layout.x20}
                title={category.packName}
                titleColor={Colors.neutral.black}
                subDetails={`${totalChannels} ${totalChannels > 1 ? t('strings.channels') : t('strings.channel')}`}
              >
                <View style={styles.channelImageContainer}>
                  {visibleSubChannels?.map((subChannel) => (
                    <View key={subChannel.channelName} style={styles.subAccordionIconContainer}>
                      <View style={styles.hdContainer}>
                        <Text style={styles.hdText} label={subChannel.hdOrSd} maxFontSize={Sizing.layout.x8} />
                      </View>
                      <Image iconName={subChannel?.imageURL} isUrl style={styles.subAccordionIcon} isDimension={false} />
                      <Text label={subChannel.channelName} style={styles.channelNameText} maxFontSize={Sizing.layout.x12} />
                      <View style={styles.channelNumberContainer}>
                        <Text label={`ch.${subChannel.epgNumber}`} style={styles.channelNumberText} maxFontSize={Sizing.layout.x12} />
                      </View>
                    </View>
                  ))}
                </View>
                {totalChannels > numberOfItems && (
                  <Button
                    label={isExpanded ? t('strings.viewLess') : t('strings.viewMore')}
                    type={STYLES.TYPE.SECONDARY}
                    onPress={() => handleToggleChannelVisibility(category.id)}
                  />
                )}
              </Accordion>
            );
          })}
        </View>
      </ScrollView>
      {!isPublic && (
        <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Button label={t('strings.back')} style={styles.buttonContainerOutLine} outline type={STYLES.TYPE.SECONDARY} onPress={() => backHandler()} />
        </View>
      )}
    </View>
  );
};

export default memo(PackViewDetails);
