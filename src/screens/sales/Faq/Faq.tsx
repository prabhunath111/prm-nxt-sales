/**
 * FAQ screen for the mSales application
 *
 * @module components/Faq
 * @memberof - View Component
 */
import React, { memo, useCallback, useEffect, useState } from 'react';
import { EmptyData, Image, Text, WebView } from 'components/sales';
import { Linking, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions';
import uiActions from 'store/sales/actions/ui';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, ICONS, MODAL, PROPERTIES, STRINGS } from 'const';
import { Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import { handleWebViewUrl } from 'utils/navigationHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { isWeb } from 'utils/platformHelper';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { openWhatsAppWithNumber } from 'utils/externalAppLinkHelper';
import { usePlatformFocusEffect } from 'hooks/usePlatformFocusEffect';
import styles from './Faq.styles';

/**
 * Component prop types.
 *
 * @typedef {object} FaqProps
 */
export type FaqProps = object;

/**
 * Represents a Faq component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */

const Faq = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(STRINGS.USER_GUIDE);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.ui);
  const { packageInformation } = useSelector((state: RootState) => state.packageInformation);
  const { userGuide: userGuideData, trainingVideo: trainingVideoData } = packageInformation ?? {};

  useEffect(() => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.FAQ.FAQPageVisit.moduleName, {
      Status: true,
      [MoengageMixpanelModules.FAQ.FAQPageVisit.attributes.Status]: true,
    });
    dispatch(actions.getPackageInformation());
  }, [dispatch]);

  usePlatformFocusEffect(
    useCallback(
      () => () => {
        setSelectedUrl(null);
        setActiveTab(STRINGS.USER_GUIDE);
      },
      [],
    ),
  );

  const handleItemClick = (url: string) => {
    if (url) {
      handleWebViewUrl(url).then((urlLink: string) => {
        setSelectedUrl(urlLink);
      });
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.FAQ.FAQClick.moduleName, {
        Status: true,
        [MoengageMixpanelModules.FAQ.FAQClick.attributes.Status]: true,
        [MoengageMixpanelModules.FAQ.FAQClick.attributes.Link]: url,
      });
    } else {
      dispatch(uiActions.showAlert(t('errors.noDataFound'), ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
    }
  };

  const openDialer = async (phoneNumber: string) => {
    const cleanedNumber = phoneNumber.replace(/[^0-9+]/g, '');
    const url = `tel:${cleanedNumber}`;
    const supported = await Linking.canOpenURL(url);

    const isCordovaWebkit = !!window.webkit?.messageHandlers?.cordova_iab;

    if ((!isWeb || isCordovaWebkit) && supported) {
      await Linking.openURL(url);
    }
  };
  const openWhatsApp = async (phoneNumber: string) => {
    let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanedNumber.startsWith('91')) {
      cleanedNumber = `91${cleanedNumber}`;
    }
    openWhatsAppWithNumber(cleanedNumber);
  };

  const TabHeader = () => (
    <View style={styles.tabContainer}>
      <Pressable onPress={() => setActiveTab(STRINGS.USER_GUIDE)} style={[styles.tabItem, activeTab === STRINGS.USER_GUIDE && styles.activeTab]}>
        <Text style={[styles.tabText, activeTab === STRINGS.USER_GUIDE && styles.activeTabText]}>{t('strings.userGuide')}</Text>
      </Pressable>

      <Pressable onPress={() => setActiveTab(STRINGS.TRAINING_VIDEO)} style={[styles.tabItem, activeTab === STRINGS.TRAINING_VIDEO && styles.activeTab]}>
        <Text style={[styles.tabText, activeTab === STRINGS.TRAINING_VIDEO && styles.activeTabText]}>{t('strings.trainingVideo')}</Text>
      </Pressable>
    </View>
  );
  const TabContentSection = ({ data, iconName }: { data: ParentObject[]; iconName: string }) => (
    <View style={styles.cardContainer}>
      {data?.map((item: ParentObject, index: number) => (
        <Pressable key={item?.linkURL || index} onPress={() => handleItemClick(item?.linkURL)}>
          <View style={[styles.textContainer, index === Sizing.layout.x0 && styles.textTopSpacing]}>
            {/* Left icon + text */}
            <View style={styles.leftSection}>
              <Image iconName={iconName} width={Sizing.layout.x2} height={Sizing.layout.x2} style={styles.iconStyle} />
              <Text style={styles.textStyle}>{item?.linkName}</Text>
            </View>
          </View>

          {index !== data.length - 1 && <View style={styles.separator} />}
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      {selectedUrl ? (
        <WebView uri={selectedUrl} />
      ) : (
        <ScrollView>
          <View style={[styles.addBackground, styles[gcs('dynamicCardContainer80P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
            {PROPERTIES.FAQ.HELP_LINE_NUMBERS.map((item) => {
              const isWhatsapp = item.title === STRINGS.DEALER_WHATSAPP;
              const iconName = isWhatsapp ? ICONS.WHATSAPP : ICONS.TELEPHONE;

              return (
                <View key={item.title} style={styles.box}>
                  <Text style={styles.helpTitle}>{t(`strings.${item.title}`)}</Text>

                  <View style={styles.numberContainer}>
                    {!!item?.num1 && (
                      <Pressable style={styles.mobileNumView} onPress={() => (isWhatsapp ? openWhatsApp(item.num1) : openDialer(item.num1))}>
                        <Image iconName={iconName} isDimension={false} width={Sizing.layout.x16} height={Sizing.layout.x16} style={styles.phoneIcon} />
                        <Text label={item.num1} style={[styles.secondaryTextManage, styles.appColorPink]} />
                      </Pressable>
                    )}

                    {!!item?.num2 && (
                      <Pressable style={styles.mobileNumView} onPress={() => (isWhatsapp ? openWhatsApp(item.num2) : openDialer(item.num2))}>
                        <Image iconName={iconName} isDimension={false} width={Sizing.layout.x16} height={Sizing.layout.x16} style={styles.phoneIcon} />
                        <Text label={item.num2} style={[styles.secondaryTextManage, styles.appColorPink]} />
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={[styles.tabWrapper, styles[gcs('dynamicCardContainer80P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
            <TabHeader />
            <View style={styles.tabContent}>
              {userGuideData || trainingVideoData || isLoading ? (
                <View style={styles.cardContainer}>
                  {activeTab === STRINGS.USER_GUIDE && userGuideData && <TabContentSection iconName={ICONS.USER_GUIDE} data={userGuideData} />}
                  {activeTab === STRINGS.TRAINING_VIDEO && trainingVideoData && <TabContentSection iconName={ICONS.VIDEO} data={trainingVideoData} />}
                </View>
              ) : (
                <EmptyData image={ICONS.EMPTY_DATA} text={STRINGS.EMPTY_FAQ_COLLECTION} />
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
export default memo(Faq);
