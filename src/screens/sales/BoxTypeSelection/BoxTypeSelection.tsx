import React, { memo, useMemo } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Button, CustomerDetailsCard, Dropdown, Text } from 'components/sales';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { ALERT, MODAL, QUERY, ROUTE, STRINGS, STYLES } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import uiActions from 'store/sales/actions/ui';
import { sliceActions as BoxTypeChangeAction } from 'store/sales/reducer/boxTypeChange';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { callAction } from 'utils/formBuilderHelper';
import i18next from 'i18next';
import styles from './BoxTypeSelection.styles';

const BoxTypeSelection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const { routeName } = useCurrentRoute();
  const BoxUpgradeState = useSelector((state: RootState) => state.boxUpgrade);
  const { accountInfoBoxData, formatedBoxData } = BoxUpgradeState;
  const { firstFlag, selectBoxDetails, boxDetails } = useSelector((state: RootState) => state.boxTypeChange);

  const enhancedBoxData = useMemo(
    () =>
      formatedBoxData.map((item: ParentObject) => {
        const type = (item.value || '').split('-').pop()?.trim() || '';
        const filteredTypes = boxDetails.filter((val: ParentObject) => val?.object?.value !== type);
        return {
          ...item,
          boxType: type,
          boxTypeOptions: filteredTypes,
        };
      }),
    [formatedBoxData],
  );

  const handleFinalSubmit = async () => {
    const selectedList = selectBoxDetails.filter((b: ParentObject) => b.newType !== null);
    if (!selectedList?.length) {
      const alertMessage = `${i18next.t('strings.selectAnyBoxType')}`;
      dispatch(
        uiActions.showAlert(
          alertMessage,
          ALERT.WARNING,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
          },
          {},
        ),
      );
      return { status: false };
    }
    try {
      dispatch(uiActions.setLoader());
      const submitPromises = selectedList.map((box: ParentObject, index: number) => {
        const [vcNumber, Type, Box] = box.boxValue.split('-');
        const payload = { boxValue: box.boxValue, upgradedType: box.newType, vcNumber, type: Type, boxType: Box, sendOrder: index === 0 };
        return dispatch(callAction(payload, QUERY.boxTypeChange, '', navigate));
      });
      await Promise.all(submitPromises);
      dispatch(uiActions.clearLoader());
      const alertMessage = `${i18next.t('strings.boxTypeChangeSuccess')}`;
      dispatch(
        uiActions.showAlert(
          alertMessage,
          ALERT.SUCCESS,
          {
            primaryText: MODAL.OK,
            secondaryText: MODAL.CANCEL,
            queryName: QUERY.BoxTypeChangeSuccess,
          },
          {},
        ),
      );
      return { status: true };
    } catch (error) {
      dispatch(uiActions.clearLoader());
      return { status: false, error };
    }
  };

  const handleCancel = () => {
    navigate(ROUTE.WEB.BOX_TYPE_CHANGE);
  };

  const handelDropDownChange = (selected: ParentObject | null, index: number, item: ParentObject) => {
    dispatch(
      BoxTypeChangeAction.updateSelectedBox({
        index,
        boxValue: item.value,
        newType: selected?.object?.value || null,
      }),
    );
  };

  const checkWoStatus = () => {
    dispatch(BoxTypeChangeAction.setFirstFlag(false));
    dispatch(callAction({}, QUERY.GetWorkOrderDetailsBoxType, '', navigate));
  };

  const boxMessageText = useMemo(() => {
    const isSingle = accountInfoBoxData?.boxDetails?.length === 1;

    if (routeName === ROUTE.WEB.SELECT_BOX_TYPE) {
      return isSingle ? 'strings.singleBoxMessageChange' : 'strings.multipleBoxMessageChange';
    }
    return isSingle ? 'strings.singleBoxMessageUpgrade' : 'strings.multipleBoxMessageUpgrade';
  }, [routeName, accountInfoBoxData]);

  return (
    <SafeAreaView style={[styles.container]} testID="SelectBox">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer80P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          <CustomerDetailsCard />
          <View style={styles.AccoContainer}>
            <Text style={styles.dropdownText}>{t(boxMessageText)}</Text>
          </View>
          <View style={styles.outerView}>
            {enhancedBoxData.map((item: ParentObject, index: number) => (
              <View style={styles.boxContanair}>
                <Text style={styles.boxText}>{item.value}</Text>
                <View style={styles.boxDropdown}>
                  <Dropdown
                    data={item?.boxTypeOptions}
                    onSelect={(selected) => handelDropDownChange(selected, index, item)}
                    queryParams="searchLocally"
                    queryName={STRINGS.CATEGORY_DROPDOWN}
                    placeholder={STRINGS.SELECT_BOX_TYPE}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={[styles.buttonInnerContainer, styles[gcs('buttonInnerContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <View style={[styles.textWrapperETSK, styles[gcs('textWrapperETSK', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
            {firstFlag && <Button style={styles.button} onPress={handleFinalSubmit} label={t('strings.changeBox')} fontSize={Sizing.layout.x16} />}
            {!firstFlag && <Button style={styles.button} onPress={checkWoStatus} label={t('strings.checkWO')} fontSize={Sizing.layout.x16} />}
            <Button onPress={handleCancel} label={t('strings.cancel')} fontSize={Sizing.layout.x16} outline type={STYLES.TYPE.SECONDARY} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(BoxTypeSelection);
