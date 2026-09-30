/**
 * This is a table type component with free packs for the userto select the type, name and duration of the offer
 *
 * @module components/OfferSelectionTable
 * @memberof CommonComponent
 */

import React, { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { Colors, Sizing } from 'styles';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from 'store';
import uiActions from 'store/sales/actions/ui';
import Dropdown from 'components/sales/Dropdown';
import Image from 'components/sales/Image';
import Text from 'components/sales/Text';
import { getPackagesURLsTrai } from 'store/sales/actions/etskRegistration/etskRegistration.action';
import { STRINGS, ICONS, ALERT, MODAL } from 'const';
import { sliceActions } from 'store/sales/reducer/etskRegistration';
import styles from './OfferSelectionTable.styles';

/**
 * Component type definitions
 *
 * @typedef {object} OfferSelectionTableProps
 * @property {string} [text] - The content for the component
 */

export type OfferSelectionTableProps = {
  placeholder1?: string;
  placeholder2?: string;
  placeholder3?: string;
};
export type PackageInfoType = { productLine: string; uom: string; pricePt: string; packName: string; packNameNT: string };

export type PackageNameType = {
  OfferCategory: string;
  PackageInfo: PackageInfoType[];
};

/**
 * Represents a OfferSelectionTable component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered OfferSelectionTable component
 *
 * @example
 * <OfferSelectionTable text="Hello World!" />
 */

const OfferSelectionTable = ({ placeholder1, placeholder2, placeholder3 }: OfferSelectionTableProps) => {
  let { packageName } = useSelector((state: RootState) => state.etskRegistration).accountCreationSuccessData;
  const { accountCreationSuccessData } = useSelector((state: RootState) => state.etskRegistration);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [offerCategoryOptions, setOfferCategoryOptions] = useState<{ name: string; value: string }[]>([]);
  const [durationOptions, setDurationOptions] = useState<{ name: string; value: string }[]>([]);
  const [offerTypeOptions, setOfferTypeOptions] = useState<{ name: string; value: string }[]>([]);

  const [selectedOfferCategory, setSelectedOfferCategory] = useState<{ name: string; value: string }>();
  const [selectedDuration, setSelectedDuration] = useState<{ name: string; value: string }>();
  const [selectedOfferType, setSelectedOfferType] = useState<{ name: string; value: string }>();

  const navigateToPackageDetails = async () => {
    const { urls } = await dispatch(getPackagesURLsTrai({}, STRINGS.GET_PACKAGES_URL_TRAI));
    Linking.openURL(urls).catch((err) => dispatch(uiActions.showAlert(`${t('strings.failedToOpenURL')}: ${err.message}`, ALERT.ERROR, { primaryText: MODAL.OK }, { data: {} })));
  };
  // we need to clear all selected pack if user changes the duration
  const handleSelectDuration = (val: { name: string; value: string }) => {
    setSelectedDuration(val);
    dispatch(sliceActions.etskClearSelectedPacksToBuyData());
  };

  useEffect(() => {
    if (accountCreationSuccessData) {
      packageName = accountCreationSuccessData?.packageName;
      const formatted = packageName?.map((item: PackageNameType) => ({
        name: item.OfferCategory,
        value: item.OfferCategory,
      }));
      setOfferCategoryOptions(formatted);

      if (formatted?.length > 0) {
        setSelectedOfferCategory(formatted[0]);
      }
    }
  }, [accountCreationSuccessData]);

  useEffect(() => {
    const selectedCategory = packageName?.find((item: PackageNameType) => item.OfferCategory === selectedOfferCategory?.value);
    if (selectedCategory) {
      let selectOne;
      const selectedDurations = selectedCategory.PackageInfo?.map((p: PackageInfoType) => p.uom);
      const formatted = selectedDurations?.map((span: string) => {
        const item = { name: span, value: span };
        if (span === t('strings.MONTHLY')) {
          selectOne = item;
        }
        return item;
      });
      setDurationOptions(formatted);

      if (formatted.length > 0) {
        setSelectedDuration(selectOne);
      }
    }
  }, [selectedOfferCategory]);

  useEffect(() => {
    const selectedCategory = packageName?.find((item: { OfferCategory: string; PackageInfo: object[] }) => item.OfferCategory === selectedOfferCategory?.value);
    if (selectedCategory) {
      const offers = selectedCategory.PackageInfo?.filter((p: PackageInfoType) => p.uom === selectedDuration?.value);
      const formatted = offers?.map((p: PackageInfoType) => ({
        name: p.packName,
        value: p.packNameNT,
        price: p.pricePt,
      }));
      setOfferTypeOptions(formatted);

      if (formatted.length > 0) {
        setSelectedOfferType(formatted[0]);
        dispatch(sliceActions.etskSetFreePackSelected(formatted[0].value));
        dispatch(sliceActions.etskSetPrimaryBoxPrice(formatted[0].price));
      }
    }
  }, [selectedDuration, selectedOfferCategory]);

  return (
    <View style={styles.container} testID="OfferSelectionTable">
      <View style={styles.innerTopContainer} />
      <View style={styles.innerBottomContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t('strings.OFFER_TYPE')}</Text>
          <View style={styles.labelDropDownContainer}>
            <Dropdown
              placeholder={placeholder2}
              placeholderTextColor={Colors.violet.v200}
              innerContainerStyle={styles.innerDropDown}
              data={offerCategoryOptions}
              selectedValue={selectedOfferCategory}
              onSelect={(val: { name: string; value: string }) => setSelectedOfferCategory(val)}
            />
          </View>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t('strings.selectFTADuration')}</Text>
          <View style={styles.labelDropDownContainer}>
            <Dropdown
              placeholder={placeholder1}
              placeholderTextColor={Colors.violet.v200}
              innerContainerStyle={styles.innerDropDown}
              data={durationOptions}
              selectedValue={selectedDuration}
              onSelect={(val: { name: string; value: string }) => handleSelectDuration(val)}
            />
          </View>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t('strings.OFFER_NAME')}</Text>
          <View style={styles.labelDropDownContainer}>
            <Dropdown
              placeholder={placeholder3}
              placeholderTextColor={Colors.violet.v200}
              innerContainerStyle={styles.innerDropDown}
              data={offerTypeOptions}
              selectedValue={selectedOfferType}
              onSelect={(val: { name: string; value: string }) => setSelectedOfferType(val)}
            />
          </View>
        </View>
        <View style={styles.linkContainer}>
          <Text style={styles.link} onPress={navigateToPackageDetails}>
            {t('strings.clickToKnowPackageDetails')}
          </Text>
          <Image iconName={ICONS.NEW_TAB} height={Sizing.layout.x14} width={Sizing.layout.x14} style={styles.linkIcon} isDimension={false} />
        </View>
      </View>
    </View>
  );
};

export default OfferSelectionTable;
