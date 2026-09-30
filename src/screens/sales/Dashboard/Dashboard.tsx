/**
 * dashboard screen for msales having charts and tables
 *
 * @module components/Dashboard
 * @memberof - View Component
 */
import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
import { CumulativeDashboard, MonthWiseDashboard, Tabs } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { PROPERTIES, QUERY, STRINGS } from 'const';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import env from 'config/env';
import styles from './Dashboard.styles';

/**
 * Represents a Dashboard component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(callAction({ moduleName: STRINGS.DASHBOARD, externalUrl: env.DASHBOARD_EXTERNAL_URL }, QUERY.GetSSORedirectionToken));
  }, []);

  const tabs = [
    {
      key: PROPERTIES.DASHBOARD.monthWise,
      title: t('strings.monthWise'),
      component: <MonthWiseDashboard />,
    },
    {
      key: PROPERTIES.DASHBOARD.cumulative,
      title: t('strings.cumulative'),
      component: <CumulativeDashboard />,
    },
  ];
  return (
    <View style={styles.container}>
      <Tabs tabs={tabs} />
    </View>
  );
};

export default memo(Dashboard);
