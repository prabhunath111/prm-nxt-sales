/**
 * Package information screen for the mSales application
 *
 * @module components/PackageInformation
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { Card, EmptyData, FormHeader, Text, WebView } from 'components/sales';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'store/sales/actions';
import uiActions from 'store/sales/actions/ui';
import { AppDispatch, RootState } from 'store';
import { ParentObject } from 'store/sales/types/common';
import { useTranslation } from 'react-i18next';
import { ALERT, FORMS, ICONS, MODAL, STRINGS } from 'const';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { handleWebViewUrl } from 'utils/navigationHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './PackageInformation.styles';

/**
 * Represents a PackageInformation component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */

const PackageInformation = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { packageInformation } = useSelector((state: RootState) => state.packageInformation);
  const [packageData, setPackageData] = useState<ParentObject[] | null>(null);

  useEffect(() => {
    dispatch(actions.getPackageInformation());
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PackageInformation.pageVisit.moduleName, {
      Status: true,
      [MoengageMixpanelModules.PackageInformation.pageVisit.attributes.Status]: true,
    });
  }, []);

  useEffect(() => {
    if (packageInformation) {
      setPackageData(packageInformation?.packageInformation);
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.PackageInformation.PackageInformationClick.moduleName, {
        Status: true,
        [MoengageMixpanelModules.PackageInformation.PackageInformationClick.attributes.Status]: true,
        [MoengageMixpanelModules.PackageInformation.PackageInformationClick.attributes.LinkName]: packageInformation,
      });
    }
  }, [packageInformation]);

  const handleItemClick = (item: { linkName: string; linkURL: string }) => {
    if (item.linkURL) {
      handleWebViewUrl(item.linkURL).then((urlLink: string) => {
        setSelectedUrl(urlLink);
      });
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.PackageInformation.PackageInformationClick.moduleName, {
        Status: true,
        [MoengageMixpanelModules.PackageInformation.PackageInformationClick.attributes.Status]: true,
        [MoengageMixpanelModules.PackageInformation.PackageInformationClick.attributes.LinkName]: item.linkName,
      });
    } else {
      dispatch(uiActions.showAlert(t('errors.noDataAvailable'), ALERT.INFO, { primaryText: MODAL.OK }, { data: {} }));
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      {selectedUrl ? (
        <WebView uri={selectedUrl} />
      ) : (
        <>
          <View style={[styles.header, styles[gcs('header', inflection, true, ['md', 'lg', 'xl'])]]}>
            <FormHeader formName={FORMS.packageInformation as FormNameKeys} />
          </View>
          <ScrollView>
            <Card cardStyle={[styles.commonCardContainer, styles[gcs('commonCardContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              {packageData ? (
                <>
                  <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{t('strings.moreWaysToHelp')}</Text>
                    <Text style={styles.subHeaderText}>{t('strings.choosePackageToView')}</Text>
                  </View>
                  <View style={[styles.cardContainer, styles[gcs('cardContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
                    {packageData?.map((item: ParentObject) => (
                      <Pressable key={item?.linkName} onPress={() => handleItemClick(item as { linkName: string; linkURL: string })}>
                        <Card cardStyle={[styles.cardStyle, styles[gcs('cardStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
                          <View style={styles.textContainer}>
                            <Text style={styles.textStyle}>{item?.linkName}</Text>
                          </View>
                        </Card>
                      </Pressable>
                    ))}
                  </View>
                </>
              ) : (
                <EmptyData image={ICONS.EMPTY_DATA} text={STRINGS.EMPTY_PACKAGE_INFO_COLLECTION} />
              )}
            </Card>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default memo(PackageInformation);
