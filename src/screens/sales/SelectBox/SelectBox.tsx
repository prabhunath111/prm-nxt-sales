import React, { memo, useEffect, useMemo, useState } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Button, CustomerDetailsCard, InformationText, RadioContainer, Text } from 'components/sales';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { ICONS, QUERY, ROUTE, STRINGS, STYLES } from 'const';
import { ParentObject } from 'store/sales/types/common';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import { sliceActions } from 'store/sales/reducer/boxUpgrade';
import { sliceActions as BoxTypeChangeAction } from 'store/sales/reducer/boxTypeChange';
import boxAction from 'store/sales/actions/boxUpgrade';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { callAction } from 'utils/formBuilderHelper';
import uiActions from 'store/sales/actions/ui';
import Autocomplete from 'components/sales/Autocomplete';
import styles from './SelectBox.styles';

const SelectBox = () => {
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  const [isHD, setHD] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { navigate } = useNavigate();
  const { routeName } = useCurrentRoute();
  const BoxUpgradeState = useSelector((state: RootState) => state.boxUpgrade);
  const { accountInfoBoxData, eligibles, upgradedType, formatedBoxData, selectedBox } = BoxUpgradeState;
  const { subId } = accountInfoBoxData;
  const { firstFlag } = useSelector((state: RootState) => state.boxTypeChange);
  const mappedData = useMemo(
    () =>
      formatedBoxData.map((item: ParentObject) => ({
        id: item.text,
        name: item.value,
        object: item,
      })),
    [formatedBoxData],
  );

  const selectedBoxObj = useMemo(() => mappedData.find((item: ParentObject) => item.id === selectedBox || item.name === selectedBox), [mappedData, selectedBox]);
  const iconMap: Record<string, string> = {
    SD: ICONS.SD_BOX,
    HD: ICONS.HD_BOX,
    HD4K: ICONS.FOURK_BOX,
    Android: ICONS.ANDROID_BOX,
    HDPVRTransfer: ICONS.PVR_BOX,
  };
  const cleanedBalance = accountInfoBoxData?.balance?.includes('₹') ? accountInfoBoxData?.balance?.replace('₹', '').trim() : accountInfoBoxData?.balance?.trim();

  const formattedDetails = useMemo(
    () =>
      eligibles?.map((item: ParentObject) => {
        const icon = iconMap[item?.NEW_BOXNT] || ICONS.DEFAULT;
        const amountNum = Number(item?.AMOUNT);
        const amountValue = !Number.isNaN(amountNum) ? `₹${amountNum}/-` : '';
        return {
          text: item?.NEW_BOXNT || '',
          value: item?.AMOUNT ?? '',
          imageUrl: icon,
          amount: amountValue,
          boxName: item?.NEW_BOXNT || '',
        };
      }),
    [eligibles],
  );

  const chnageValue = ({ value, name }: ParentObject) => {
    if (value && name) {
      setSelectedRadio(value);
      setRequiredAmount(value);
      dispatch(sliceActions.setRechargeAmount(value.toString()));
      dispatch(sliceActions.setUpgradeBoxType(name));
      if (name === STRINGS.HD) {
        return setHD(true);
      }
      return setHD(false);
    }
    return false;
  };
  useEffect(() => {
    if (formattedDetails && formattedDetails.length > 0) {
      if (BoxUpgradeState?.rechargeAmount) {
        const storedValue = BoxUpgradeState.rechargeAmount;
        const storedItem = formattedDetails.find((item: ParentObject) => item.value === storedValue);
        if (storedItem) {
          setSelectedRadio(storedItem.value);
          chnageValue({ value: storedItem.value, name: storedItem.text });
          return;
        }
      }
      const defaultItem = formattedDetails[0];
      setSelectedRadio(defaultItem.value);
      chnageValue({ value: defaultItem.value });
    }
  }, [formattedDetails, selectedBoxObj]);

  const handleFinalSubmit = () => {
    if (routeName === ROUTE.WEB.SELECT_BOX_TYPE) {
      return dispatch(callAction({ upgradedType }, QUERY.boxTypeChange, '', navigate));
    }
    if (upgradedType === STRINGS.HD) {
      dispatch(sliceActions.setFinalRequiredAmount(requiredAmount.toString()));
      dispatch(sliceActions.setPaidAmount(requiredAmount.toString()));
      dispatch(sliceActions.setRechargeFlag(true));
      dispatch(sliceActions.setbingeFlag(false));
      dispatch(sliceActions.setUpgradeToNT(STRINGS.HD));
      return dispatch(boxAction.proceedWithRechargeBox());
    }
    dispatch(sliceActions.setRechargeFlag(true));
    return navigate(ROUTE.WEB.CONFIRM_DETAILS);
  };

  const handleCancel = () => {
    if (routeName === ROUTE.WEB.SELECT_NEW_BOX) {
      navigate(ROUTE.WEB.BOX_UPGRADE);
    }
    if (routeName === ROUTE.WEB.SELECT_BOX_TYPE) {
      navigate(ROUTE.WEB.BOX_TYPE_CHANGE);
    }
  };

  const handelDropDownChange = (value: ParentObject) => {
    const [vcNumber, type, quality] = (value?.name || '').split('-');
    dispatch(sliceActions.setSelectedBox(value?.name));
    dispatch(sliceActions.setSelectedBoxVcNumber(vcNumber));
    dispatch(sliceActions.setSelectedBoxType(type));
    dispatch(sliceActions.setSelectedBoxConnectionType(quality));
    if (routeName === ROUTE.WEB.SELECT_NEW_BOX) {
      dispatch(callAction({ quality, screen: true }, QUERY.isEligibleForUpgrade, '', navigate));
    }
    if (routeName === ROUTE.WEB.SELECT_BOX_TYPE) {
      dispatch(callAction({ campaign: value?.name }, QUERY.exitingWorkOrder, '', navigate));
    }
  };

  const handleFinalSubmitWithoutRecharge = () => {
    dispatch(sliceActions.setbingeFlag(false));
    dispatch(sliceActions.setPaidAmount('0'));
    dispatch(sliceActions.setFinalRequiredAmount(requiredAmount.toString()));
    dispatch(sliceActions.setUpgradeToNT(STRINGS.HD));
    dispatch(sliceActions.setRechargeFlag(false));
    dispatch(sliceActions.setEVDPin(''));
    dispatch(uiActions.setLoader());
    return dispatch(callAction({}, QUERY.FinalBoxUpgradation, '', navigate));
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
    return isSingle ? 'strings.singleBoxUpgradeSubID' : 'strings.multipleBoxMessageUpgrade';
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
            <Text style={styles.dropdownText}>{t(boxMessageText, { amount: subId })}</Text>
            <View style={styles.dropdownContainer}>
              <Autocomplete
                data={mappedData}
                selectedValue={selectedBoxObj}
                onSelect={handelDropDownChange}
                isCloseIconRequired={false}
                queryParams="searchLocally"
                actionNeeded={false}
                queryName={STRINGS.CATEGORY_DROPDOWN}
                isReadOnly
              />
            </View>
          </View>
          <View>
            <RadioContainer
              radioItemContainer={styles.largeContainer}
              items={formattedDetails}
              onSelectionChange={(selectedValue: string) => {
                const selectedItem = formattedDetails.find((item: ParentObject) => item.value === selectedValue);
                if (selectedItem) {
                  chnageValue({
                    value: selectedItem.value,
                    name: selectedItem.text,
                  });
                }
              }}
              allowDeselect={formattedDetails.length > 1}
              selectedValue={selectedRadio}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={[styles.buttonInnerContainer, styles[gcs('buttonInnerContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          {routeName !== ROUTE.WEB.SELECT_BOX_TYPE && (
            <View>
              <InformationText
                containerStyle={styles.textWrapper}
                primaryStyle={[styles.primaryTextYourPack, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                secondaryStyle={styles.secondaryTextYourPack}
                primaryText={t('strings.balance')}
                secondaryText={`₹${cleanedBalance}`}
              />
              <InformationText
                containerStyle={styles.textWrapper}
                primaryStyle={[styles.primaryTextYourPack, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                secondaryStyle={styles.secondaryTextYourPack}
                primaryText={t('strings.REQUIRED_AMOUNT')}
                secondaryText={`₹${requiredAmount}`}
              />
            </View>
          )}
          {routeName === ROUTE.WEB.SELECT_NEW_BOX && (
            <View style={[styles.textWrapperETSK, styles[gcs('textWrapperETSK', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
              <Button onPress={handleFinalSubmitWithoutRecharge} label={t('strings.changeBoxType')} fontSize={Sizing.layout.x16} disabled={!isHD} />
              <Button style={styles.button} onPress={handleFinalSubmit} label={t('strings.changeBoxWithRecharge')} fontSize={Sizing.layout.x16} />
              <Button onPress={handleCancel} label={t('strings.cancel')} fontSize={Sizing.layout.x16} outline type={STYLES.TYPE.SECONDARY} />
            </View>
          )}
          {routeName === ROUTE.WEB.SELECT_BOX_TYPE && (
            <View style={[styles.textWrapperETSK, styles[gcs('textWrapperETSK', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
              {firstFlag && <Button style={styles.button} onPress={handleFinalSubmit} label={t('strings.changeBox')} fontSize={Sizing.layout.x16} />}
              {!firstFlag && <Button style={styles.button} onPress={checkWoStatus} label={t('strings.checkWO')} fontSize={Sizing.layout.x16} />}
              <Button onPress={handleCancel} label={t('strings.cancel')} fontSize={Sizing.layout.x16} outline type={STYLES.TYPE.SECONDARY} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(SelectBox);
