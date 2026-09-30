import React, { memo, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import { Button, DynamicTable, Gradient, IconTextInput, Text } from 'components/sales';
import { Colors, Sizing } from 'styles';
import { CHILD_TYPE, ICONS, ROUTE, STYLES } from 'const';
import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import uiActions from 'store/sales/actions/ui';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import actions from 'store/sales/actions';
import useNavigate from 'hooks/useNavigate';
import { sliceActions } from 'store/sales/reducer/dealerHelp';
import { sliceActions as sliceAction } from 'store/sales/reducer/storeDashboard';
import styles from './BingeRetailerDashboard.styles';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

const BingeRetailerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { navigate, goHome } = useNavigate();
  const { inflection } = useInflection();
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { isLoading } = useSelector((state: RootState) => state.ui);
  const { selectedDate } = useSelector((state: RootState) => state.storeDashboard);
  const { bingTableColumn, bingeTableData, dashboardBingeRetailerLatest } = useSelector((state: RootState) => state.dealerHelp);
  const [selectDate, setSelectDate] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const [showTable, setShowTable] = useState(false);

  const handleSubmit = () => {
    if (!selectDate) {
      setDateError(t('validations.selectDateRequired'));
      setShowTable(false);
      return;
    }
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.BingRetailer.Dashboard_DateSelectionSubmit.moduleName, {
      [MoengageMixpanelModules.BingRetailer.Dashboard_DateSelectionSubmit.attributes.Status]: true,
    });
    dispatch(sliceActions.resetBingeTableData());
    dispatch(actions.bingeDshBoardDtlsFromService({ fromDt: date }));
    setDateError('');
    setShowTable(true);
  };
  const handleSelection = () => {
    dispatch(sliceAction.resetDateForStoreDashboard());
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.SIMPLE_CALENDER,
        headerTitle: t('strings.selectDate'),
        showHeader: true,
        buttonInfo: {
          isMultiDates: false,
        },
      }),
    );
  };
  const handleBack = () => {
    navigate(ROUTE.WEB.BINGE_RETAILER);
  };
  const formatDateToMMDDYYYY = (dateStr: string): string => {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return '';

    return `${month}/${day}/${year}`;
  };
  useEffect(() => {
    if (selectedDate) {
      setSelectDate(formatDateToMMDDYYYY(selectedDate));
      setDate(selectedDate);
      setDateError('');
    } else {
      setSelectDate('');
      setShowTable(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    const loadInitialData = async () => {
      dispatch(uiActions.setLoader());

      try {
        dispatch(sliceAction.resetDateForStoreDashboard());
        dispatch(sliceActions.resetBingeLatestSummary());
        setSelectDate('');
        setShowTable(false);

        const res: any = await dispatch(actions.getBposDetailsDirectFromFE());

        if (res?.status) {
          await dispatch(actions.getDashboardBingeRetailerLatest(res?.data));
        }
      } catch (error: any) {
        dispatch(uiActions.showErrorPage(error?.message));
      } finally {
        dispatch(uiActions.clearLoader());
      }
    };

    loadInitialData();
  }, []);

  const summaryData = useMemo(
    () => ({
      monthlyEarning: Number(dashboardBingeRetailerLatest?.monthlyEarning) || 0,
      packSold: Number(dashboardBingeRetailerLatest?.packSoldFortheMonth) || 0,
      earningToday: Number(dashboardBingeRetailerLatest?.earningForTheDay) || 0,
      dayCount: Number(dashboardBingeRetailerLatest?.dayCount) || 0,
      lastMonthEarning: Number(dashboardBingeRetailerLatest?.previousMonthEarning) || 0,
      lastMonthCount: Number(dashboardBingeRetailerLatest?.previousMonthCount) || 0,
    }),
    [dashboardBingeRetailerLatest],
  );
  const renderCard = (title: string, value: number) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!isLoading && (
        <>
          <ScrollView showsVerticalScrollIndicator>
            <View
              style={[
                styles.detailsCardContainer,
                styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
                styles[gcs('dynamicCardContainer80P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
              ]}
            >
              <Gradient colors={Colors.gradient.dashboardGradient} style={styles.gradientContainer} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.durationRow}>
                  <View style={styles.dropdownContainer}>
                    <Pressable onPress={handleSelection}>
                      <IconTextInput
                        readOnly
                        value={selectDate}
                        placeholder={t('strings.selectDate')}
                        placeholderTextColor={Colors.neutral.g300}
                        rightIconName={ICONS.CALENDAR_PINK}
                        containerStyle={[styles.filterInputBox]}
                        onIconPress={handleSelection}
                        testID="date-input"
                      />
                    </Pressable>
                  </View>

                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Submit</Text>
                  </TouchableOpacity>
                </View>
                {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

                {/* Summary Section */}
                <Text style={styles.summaryTitle}>{t('strings.SUMMARY')}</Text>

                <Gradient colors={Colors.gradient.summaryGradient} style={styles.summaryContainer} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}>
                  {renderCard(t('strings.monthlyEarning'), summaryData.monthlyEarning)}
                  {renderCard(t('strings.packSoldThisMonth'), summaryData.packSold)}
                  {renderCard(t('strings.earningForTheDay'), summaryData.earningToday)}
                  {renderCard(t('strings.dayCount'), summaryData.dayCount)}
                  {renderCard(t('strings.lastMonthEarning'), summaryData.lastMonthEarning)}
                  {renderCard(t('strings.lastMonthCount'), summaryData.lastMonthCount)}
                </Gradient>
              </Gradient>

              {/* Table */}
              {showTable && (
                <View style={styles.alignItemCenter}>
                  {bingeTableData?.length > 0 ? (
                    <DynamicTable columns={bingTableColumn} data={bingeTableData} listStyle={styles.heightAdjust} />
                  ) : (
                    <Text style={styles.alignCenter}>{t('errors.noDataFound')}</Text>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <View style={[styles.innerButtonContainer, styles[gcs('textWrapperETSK', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
              <Button type={STYLES.TYPE.PRIMARY} style={styles.button} onPress={handleBack} label={t('strings.back')} fontSize={Sizing.layout.x16} />
              <Button type={STYLES.TYPE.SECONDARY} style={styles.button} onPress={() => goHome(isRedirection)} label={t('strings.cancel')} fontSize={Sizing.layout.x16} outline />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default memo(BingeRetailerDashboard);
