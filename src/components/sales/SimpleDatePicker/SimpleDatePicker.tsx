import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from 'styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { sliceActions } from 'store/sales/reducer/storeDashboard';
import { Button, Text, CustomCalendar } from 'components/sales';
import { ParentObject } from 'store/sales/types/common';
import { CHILD_TYPE, FORMS, HEADER_TITLE, ICONS, ROUTE } from 'const';
import uiActions from 'store/sales/actions/ui';
import useCurrentRoute from 'hooks/useCurrentRoute';

export type SimpleDatePickerProps = {
  error?: string;
  id?: string;
};

const SimpleDatePicker = ({ error = '', id }: SimpleDatePickerProps) => {
  const [tempDate, setTempDate] = useState<string>('');
  const { t } = useTranslation();
  const { routeName } = useCurrentRoute();
  const dispatch = useDispatch<AppDispatch>();
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [minDate, setMinDate] = useState<string>('');
  const { dashboardBingeRetailerLatest } = useSelector((state: RootState) => state.dealerHelp);

  const handleDateSelected = (day: ParentObject) => {
    const selectedISO = day.dateString;
    setTempDate(selectedISO);
  };

  const handleConfirmDate = () => {
    dispatch(sliceActions.setDateForStoreDashboard(tempDate));
    if (routeName === ROUTE.WEB.PURCHASE_ORDER_SETTLEMENTS || routeName === ROUTE.WEB.BINGE_RETAILER_DASHBOARD) {
      dispatch(uiActions.hideBottomModal());
      return;
    }
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        isCenterModal: true,
        type: CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM,
        headerTitle: HEADER_TITLE.STORE_DASHBOARD,
        showCloseIcon: true,
        showHeader: true,
        formName: FORMS.storeDashboard,
        headerIcon: ICONS.STORE_DASHBOARD,
        buttonInfo: {
          goToHome: true,
        },
      }),
    );
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
  }, []);

  useEffect(() => {
    if (routeName === ROUTE.WEB.BINGE_RETAILER_DASHBOARD) {
      const todayDate = new Date();
      const enableDays = Number(dashboardBingeRetailerLatest?.enableMonthDashboardBR) || 0;

      const minDateObj = new Date();
      minDateObj.setDate(todayDate.getDate() - enableDays);

      const minDateISO = minDateObj.toISOString().split('T')[0];
      setMinDate(minDateISO);
    }
  }, [dashboardBingeRetailerLatest, routeName]);

  return (
    <View testID="SimpleDatePicker">
      <CustomCalendar
        onDateSelected={handleDateSelected}
        defaultDate={startDate}
        currentDate={startDate}
        isDateRangePicker={false}
        maxDate={startDate}
        minDate={routeName === ROUTE.WEB.BINGE_RETAILER_DASHBOARD ? minDate : undefined}
      />
      <Button label={t('modal.confirm')} onPress={handleConfirmDate} />
      {error ? <Text id={`${id}error`} label={error} color={Colors.error.primary} /> : null}
    </View>
  );
};

export default SimpleDatePicker;
