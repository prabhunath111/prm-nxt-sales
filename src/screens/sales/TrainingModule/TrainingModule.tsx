import { Linking, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { Button, EmptyData, Image, Text, WebView } from 'components/sales';
import { AppDispatch, RootState } from 'store';
import uiActions from 'store/sales/actions/ui';
import actions from 'store/sales/actions';
import { ParentObject } from 'store/sales/types/common';
import { ALERT, ICONS, MODAL, ROUTE, STRINGS, STYLES } from 'const';
import { Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import { handleWebViewUrl } from 'utils/navigationHelper';
import useNavigate from 'hooks/useNavigate';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useCallback, useEffect, useState } from 'react';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { usePlatformFocusEffect } from 'hooks/usePlatformFocusEffect';
import { gcs } from 'styles/webBreakpoints';
import styles from './TrainingModule.styles';

export type TrainingModuleProps = {
  text?: string;
};

const TrainingModule = () => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(STRINGS.USER_GUIDE);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.ui);
  const { packageInformation } = useSelector((state: RootState) => state.packageInformation);
  const { userGuidePDF: userGuideData, trainingVideo: trainingVideoData } = packageInformation ?? {};
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const { inflection } = useInflection();

  useEffect(() => {
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
    if (!url) {
      dispatch(uiActions.showAlert(t('errors.noDataFound'), ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
      return;
    }

    if (url.endsWith('.mp4') || url.endsWith('.pdf')) {
      Linking.openURL(url);
    } else {
      handleWebViewUrl(url).then((urlLink: string) => {
        setSelectedUrl(urlLink);
      });
    }
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
        <Pressable onPress={() => handleItemClick(item?.linkURL)} testID={`training-item-${index}`}>
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
        <View testID="training-webview">
          <WebView uri={selectedUrl} />
        </View>
      ) : (
        <>
          <ScrollView>
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
          <View style={styles.backButton}>
            <Button
              type={STYLES.TYPE.SECONDARY}
              outline
              style={[styles.backButtonStyle, styles[gcs('backButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
              onPress={() => navigate(ROUTE.WEB.BINGE_RETAILER)}
              label={t('strings.back')}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default memo(TrainingModule);
