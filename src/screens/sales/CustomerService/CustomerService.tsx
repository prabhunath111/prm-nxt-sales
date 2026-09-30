/**
 * Customer service screen to raise and track request
 *
 * @module components/CustomerService
 * @memberof - View Component
 */
import React, { memo, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { FormHeader, Tabs } from 'components/sales';
import { FORMS, PROPERTIES, STYLE_VARIANT } from 'const';
import { useTranslation } from 'react-i18next';
import RaiseTheRequest from 'screens/sales/RaiseTheRequest';
import TrackTheRequest from 'screens/sales/TrackTheRequest';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './CustomerService.styles';

/**
 * Represents a CustomerService component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const CustomerService = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();

  MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerService.CustomerServicePageVisit.moduleName, {
    Status: true,
  });

  const tabs = [
    {
      key: PROPERTIES.RAISE_REQUEST.raiseTheRequest,
      title: t('strings.raiseTheRequest'),
      component: <RaiseTheRequest />,
    },
    {
      key: PROPERTIES.RAISE_REQUEST.trackTheRequest,
      title: t('strings.trackTheRequest'),
      component: <TrackTheRequest />,
    },
  ];
  useEffect(() => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.CustomerService.CustomerServicePageVisit.moduleName, {
      Status: true,
    });
  });
  return (
    <View style={styles.container}>
      <View style={[styles.header, styles[gcs('header', inflection, true, ['md', 'lg', 'xl'])]]}>
        <FormHeader formName={FORMS.raiseRequest as FormNameKeys} />
      </View>
      <ScrollView>
        <Tabs tabs={tabs} styleVariant={STYLE_VARIANT.P1} />
      </ScrollView>
    </View>
  );
};

export default memo(CustomerService);
