import React, { memo, useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { PROPERTIES, STYLE_VARIANT, ICONS, STRINGS } from 'const';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import { Colors, Sizing } from 'styles';
import boxAction from 'store/sales/actions/boxUpgrade';
import { sliceActions } from 'store/sales/reducer/boxUpgrade';
import { RadioContainer, Button, InformationText, Accordion, TextContainer, Tabs, CustomerDetailsCard, Text } from 'components/sales';
import { ParentObject } from 'store/sales/types/common';
import uiActions from 'store/sales/actions/ui';
import Autocomplete from 'components/sales/Autocomplete';
import styles from './BoxSelection.styles';

const BoxSelection = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const { accountInfoBoxData, upgradedType, rechargeAmount, boxType, bingeOffer, eligibles } = useSelector((state: RootState) => state.boxUpgrade);
  const [selectedRadio, setSelectedRadio] = useState<string>('');
  const [dropdownValue, setDropdownValue] = useState<ParentObject>({});
  const [finalRechargeAmount, setFinalRechargeAmount] = useState<number>(rechargeAmount);
  const [upgradeTo, setUpgradeTo] = useState<string>('');

  const dropdownItems = (bingeOffer || []).map((offer: ParentObject) => ({
    id: offer.PRICE,
    name: `${offer.SIEBELNAME} Rs-${offer.PRICE}`,
  }));

  const chnageValue = ({ value }: { value: string }) => {
    setSelectedRadio(value);
    dispatch(sliceActions.setbingeFlag(false));
  };

  const handleDropdownChange = (item: ParentObject) => {
    const finalAmount = parseFloat(item?.id ?? 0) + parseFloat(rechargeAmount ?? 0);
    setFinalRechargeAmount(finalAmount);
    dispatch(sliceActions.setFinalRequiredAmount(finalAmount.toString()));
    dispatch(sliceActions.setPaidAmount(finalAmount.toString()));
    dispatch(sliceActions.setbingeFlag(true));
    setDropdownValue(item);
  };

  const handleFinalSubmit = () => {
    if (!dropdownValue) {
      return dispatch(uiActions.showErrorPage(t('strings.bingePlusCategory')));
    }
    dispatch(sliceActions.setPaidAmount(finalRechargeAmount.toString()));
    return dispatch(boxAction.proceedWithRechargeBox());
  };

  useEffect(() => {
    dispatch(boxAction.getBingePlusData(selectedRadio));
  }, [selectedRadio]);

  useEffect(() => {
    const upgradeType = eligibles.find((item: ParentObject) => item.AMOUNTNT === rechargeAmount);
    setUpgradeTo(upgradeType?.NEW_BOX);
    dispatch(sliceActions.setUpgradeToNT(upgradeType?.NEW_BOXNT));
    dispatch(sliceActions.setUpgradeBoxType(upgradeType?.NEW_BOX));
  }, [rechargeAmount]);

  useEffect(() => {
    if (bingeOffer.length <= 0) {
      if (selectedRadio === STRINGS.NA) {
        dispatch(uiActions.showErrorPage(t('strings.packnotavailable')));
      }
      if (selectedRadio === STRINGS.MONTHLY) {
        dispatch(uiActions.showErrorPage(t('strings.monthpacknotavailable')));
      }
      if (selectedRadio === STRINGS.ANNUAL) {
        dispatch(uiActions.showErrorPage(t('strings.annualpacknotavailable')));
      }
      if (selectedRadio === STRINGS.SEMI_ANNUAL) {
        dispatch(uiActions.showErrorPage(t('strings.semipacknotavailable')));
      }
    }
  }, [bingeOffer]);

  useEffect(() => {
    if (dropdownItems) {
      const item = dropdownItems[0];
      const finalAmount = parseFloat(item?.id ?? 0) + parseFloat(rechargeAmount ?? 0);
      setFinalRechargeAmount(finalAmount);
      dispatch(sliceActions.setFinalRequiredAmount(finalAmount.toString()));
      dispatch(sliceActions.setPaidAmount(finalAmount.toString()));
      dispatch(sliceActions.setbingeFlag(true));
      setDropdownValue(item);
    }
  }, [bingeOffer]);

  useEffect(() => {
    if (finalRechargeAmount !== null && !Number.isNaN(finalRechargeAmount)) {
      dispatch(sliceActions.setFinalRequiredAmount(finalRechargeAmount.toString()));
      dispatch(sliceActions.setPaidAmount(finalRechargeAmount.toString()));
    }
  }, [finalRechargeAmount]);

  const tabs = [
    {
      key: STRINGS.SELECT_BINGE_OFFER,
      title: `${boxType} ${STRINGS.BOX}`,
      subTitle: upgradedType,
      component: (
        <View style={styles.tabPadding}>
          <Text style={styles.cardStyle}>{t('strings.bingePlusCategory')}</Text>
          <View style={[styles.centeredContainer]}>
            <View style={[styles.radioContainer]}>
              <RadioContainer
                items={PROPERTIES.BINGE_DURATION}
                onSelectionChange={(text: string) => chnageValue({ value: text })}
                allowDeselect
                selectedValue={selectedRadio}
                containerStyle={[styles.radioRow, styles[gcs('radioRow', inflection, true, ['xs', 'sm'])]]}
                radioItemContainer={styles.radioContainerStyle}
              />
            </View>
            <View key={STRINGS.YES} style={[styles.dropdownContainerStyle, styles[gcs('dropdownContainerStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
              <Autocomplete
                placeholder={t('strings.bingePlusCategory')}
                containerStyle={styles.outerContainer}
                innerContainerStyle={styles.innerDropDown}
                queryName={STRINGS.CATEGORY_DROPDOWN}
                selectedValue={dropdownValue}
                onSelect={handleDropdownChange}
                isCloseIconRequired={false}
                queryParams="searchLocally"
                actionNeeded={false}
                data={dropdownItems}
              />
            </View>
          </View>
        </View>
      ),
    },
  ];

  const customerInformationeETSK = {
    name: accountInfoBoxData?.customerName,
    primaryMobileNo: accountInfoBoxData?.maskedRMN,
    state: accountInfoBoxData?.state,
    status: accountInfoBoxData?.customerStatus,
  };
  return (
    <SafeAreaView style={[styles.container]} testID="BoxSelection">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer50P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          <CustomerDetailsCard />
          <View style={[styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
            <View style={styles.summaryContainer}>
              <View style={styles.etskContainerSummary}>
                <TextContainer
                  itemContainerStyle={styles.textWrapperManageSummary}
                  data={{
                    boxTypeChangeTo: upgradeTo,
                  }}
                  dataArray={PROPERTIES.BOX_UPGRADE.BOX_UPGRADE_TO}
                  hasSepratorBottom
                />
              </View>
              <Text style={styles.mediumLeftText}>{t('strings.boxUpgradeSummary')}</Text>
              <Text style={styles.summaryStyle}>{t('strings.SUMMARY')}</Text>
            </View>
            <Accordion
              title={t('strings.customerTOPay')}
              titleColor={Colors.neutral.white}
              accordionStyle={styles.accordionStyle}
              buttonStyle={styles.accordionBox}
              subDetails={`₹${finalRechargeAmount}`}
              subDetailsTextStyle={styles.accordionSubText}
              iconStyle={styles.iconWhite}
              isOpenDefault
            >
              <View style={styles.etskContainer}>
                <View>
                  <Text style={styles.bingeOffer}>{t('strings.bingePlus')}</Text>
                  <View style={styles.tabContainer}>
                    <Tabs tabs={tabs} styleVariant={STYLE_VARIANT.P3} />
                  </View>
                </View>
              </View>
            </Accordion>
          </View>
          <Accordion
            title={t('strings.customerInformation')}
            buttonStyle={styles.customerInformationETSK}
            collapseIcon={ICONS.PINK_CHEVRON_UP}
            expandIcon={ICONS.PINK_CHEVRON_DOWN}
            titleColor={Colors.neutral.black}
            listStyle={styles.listStyle}
            isDimension={false}
            iconHeight={Sizing.layout.x18}
            iconWidth={Sizing.layout.x18}
            isOpenDefault
          >
            <View style={styles.etskContainer}>
              <TextContainer
                itemContainerStyle={styles.textWrapperManage}
                primaryStyle={[styles.primaryTextManage, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                secondaryStyle={styles.secondaryTextManage}
                data={customerInformationeETSK}
                dataArray={PROPERTIES.BOX_UPGRADE.CUSTOMER_INFORMATION}
                hasSepratorBottom
              />
            </View>
          </Accordion>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={[styles.buttonInnerContainer, styles[gcs('buttonInnerContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <InformationText
            containerStyle={styles.textWrapperETSK}
            primaryStyle={[styles.primaryTextYourPack, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
            secondaryStyle={styles.secondaryTextYourPack}
            primaryText={t('strings.REQUIRED_AMOUNT')}
            secondaryText={`${t('strings.total')} ₹${finalRechargeAmount}`}
          />
          <Button style={styles.primaryButton} onPress={handleFinalSubmit} label={t('strings.proceedRecharge')} fontSize={Sizing.layout.x16} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(BoxSelection);
