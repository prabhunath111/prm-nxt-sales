/**
 * A component to render multiple groups of radio buttons.
 *
 * @module components/RadioGroup
 * @memberof CommonComponent
 */

import React, { FC, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ParentObject } from 'store/sales/types/common';
import InformationText from 'components/sales/InformationText';
import { useTranslation } from 'react-i18next';
import Image from 'components/sales/Image';
import { Sizing } from 'styles';
import { CHILD_TYPE, HEADER_TITLE, ICONS, MODAL, PROPERTIES, RADIO_GROUP, STRINGS } from 'const';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import Text from 'components/sales/Text';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import commonAction from 'store/sales/actions/customerRecharge';
import uiActions from 'store/sales/actions/ui';
import { sliceActions as customerActions } from 'store/sales/reducer/customerRecharge';
import styles from './RadioGroup.styles';

/**
 * SubItem type definition
 *
 * @typedef {object} SubItem
 * @property {string} key - The unique key for the sub-item.
 * @property {string} [type] - The type of the sub-item.
 */
type SubItem = {
  key: string;
  type?: string;
  separator?: string;
};

/**
 * RadioItem type definition
 *
 * @typedef {object} RadioItem
 * @property {string} key - The unique key for the radio item.
 * @property {string} [type] - The type of the radio item.
 * @property {SubItem[]} [subItems] - The sub-items of the radio item.
 */
type RadioItem = {
  key: string;
  type?: string;
  subItems?: SubItem[];
  separator?: string;
};

/**
 * RadioGroupType type definition
 *
 * @typedef {object} RadioGroupType
 * @property {string} [heading] - The heading text for the group.
 * @property {RadioItem[]} items - The array of radio items in the group.
 * @property {ParentObject} data - The data object containing values for the items.
 */
type RadioGroupType = {
  heading?: string;
  items: RadioItem[];
  data: ParentObject;
  showIcon?: boolean;
};

/**
 * RadioGroupProps type definition
 *
 * @typedef {object} RadioGroupProps
 * @property {RadioGroupType[]} groups - The array of radio groups.
 * @property {function} onSelect - Callback function to handle the selection of a radio item.
 * @property {string} [selectedKey] - The key of the currently selected radio item.
 */
export type RadioGroupProps = {
  groups: RadioGroupType[];
  onSelect: (selectedValue: string, id?: string) => void;
  unSelectedValue?: string;
};

/**
 * Represents a RadioButton component
 *
 * @param {object} props - React properties passed from the parent component.
 * @param {RadioItem} props.item - The radio item data.
 * @param {SubItem[]} [props.subItems] - The sub-items for the radio item.
 * @param {ParentObject} props.data - The data object containing values for the items.
 * @param {boolean} props.isSelected - Flag indicating if the radio button is selected.
 * @param {function} props.onPress - Function to handle the press event.
 * @returns {JSX.Element} The rendered RadioButton component.
 */
interface RadioButtonProps {
  item: RadioItem;
  subItems?: SubItem[];
  data: ParentObject;
  isSelected: boolean;
  onPress: () => void;
}

const RadioButton: FC<RadioButtonProps> = ({ isSelected, item, subItems, data, onPress }) => {
  const { inflection } = useInflection();
  const hiddenKeys = new Set([STRINGS.DEALER_MARGIN_ANNUAL, STRINGS.DEALER_MARGIN_SEMI, STRINGS.DEALER_MARGIN_QUARTER]);
  return data[item.key] && data[item.key] !== 'NA' ? (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress} testID="radioBtn">
      <View style={[styles.radioCircle, isSelected && styles.selectedRadioCircle]}>{isSelected ? <View style={styles.selectedRb} /> : null}</View>
      <View style={styles.subContainer}>
        <InformationText
          key={item.key}
          primaryText={item.key}
          secondaryText={data[item.key]}
          primaryStyle={[styles.primaryTextStyle, styles[gcs('primaryTextStyle', inflection, true, ['md', 'lg', 'xl'])]]}
          secondaryStyle={styles.secondaryTextStyle}
          containerStyle={styles.itemContainer}
          type={item.type}
          separator={item.separator}
        />
        {subItems?.map((subItem) => {
          const value = data[subItem.key];
          if (hiddenKeys.has(subItem.key) && Number(value) === 0) {
            return null;
          }
          return (
            <InformationText
              key={subItem.key}
              primaryText={subItem.key}
              secondaryText={value}
              primaryStyle={styles.subTextStyle}
              secondaryStyle={styles.subTextStyle}
              containerStyle={styles.itemContainer}
              type={subItem.type}
              separator={item.separator}
            />
          );
        })}
      </View>
    </TouchableOpacity>
  ) : null;
};

const DynamicRadioButton = ({ isSelected, data, onPress }: any) => {
  const { t } = useTranslation();
  const { inflection } = useInflection();

  return (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress} testID="dynamic-radio-btn">
      <View style={[styles.radioCircle, isSelected && styles.selectedRadioCircle]}>{isSelected ? <View style={styles.selectedRb} /> : null}</View>
      <View style={styles.subContainer}>
        <Text
          style={[styles.primaryTextStyle, styles[gcs('primaryTextStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        >{`${data?.bingePlanInfoText?.[1]}-${data?.bingeRechargeValue}`}</Text>
        <Text style={[styles.subTextStyle, styles.gap5]}>{`${t('strings.flexiDealerIncentiveAnnual')} - ${data?.bingePlanInfoText?.[0] || ''}`}</Text>
        <Text style={[styles.subTextStyle, styles.gap5]}>{data?.bingePlanInfoText?.[2]}</Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Represents a RadioGroup component
 *
 * @param {RadioGroupProps} props - React properties passed from the parent component.
 * @returns {JSX.Element} The rendered RadioGroup component.
 *
 * @example
 * const groups = [
 *   {
 *     heading: 'rechargeFlexiPlan',
 *     items: [
 *       { key: 'flexiRechargeAmountAnnual', subItems: [{ key: 'flexiAnnualBonus' }, { key: 'flexiDealerIncentiveAnnual' }] },
 *       { key: 'flexiRechargeAmountSemiAnnual', subItems: [{ key: 'flexiSemiAnnualBonus' }, { key: 'flexiDealerIncentiveSemiAnnual' }] },
 *     ],
 *     data: accordionData,
 *   },
 * ];
 *
 * const handleSelect = (selectedValue) => {
 *   console.log(selectedValue);
 * };
 *
 * <RadioGroup groups={groups} onSelect={handleSelect} />
 */
const RadioGroup: FC<RadioGroupProps> = ({ groups, onSelect, unSelectedValue = null }) => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIdRadio } = useSelector((state: RootState) => state.customerRecharge);

  const offerKeyMap: Record<string, string> = {
    annualWinbackOffer: '11M',
    semiAnnualWinbackOffer: '6M',
    quarterWinbackOffer: '3M',
  };

  const handleSelect = (id: string) => {
    dispatch(customerActions.setSelectedIdRadio(id));
    const selectedGroup = groups.find((group) => group.items.some((item) => item.key === id));
    const selectedItem = selectedGroup?.items.find((item) => item.key === id);
    if (selectedItem) {
      if (selectedGroup?.data?.bingeOffer === PROPERTIES.CUSTOMER_RECHARGE.U && selectedItem?.key === PROPERTIES.CUSTOMER_RECHARGE.BINGE_RECHARGE_VALUE) {
        dispatch(commonAction.setBingFlag(selectedGroup?.data?.bingeOffer));
        dispatch(customerActions.setAndroidUpgradeSelected(true));
        dispatch(customerActions.setSelectedOffer(null));
      } else if (
        selectedItem?.key === STRINGS.ANNUAL_WINBACK_OFFER ||
        selectedItem?.key === STRINGS.SEMI_ANNUAL_WINBACK_OFFER ||
        selectedItem?.key === STRINGS.QUARTER_WINBACK_OFFER
      ) {
        const requiredOfferKey = offerKeyMap[selectedItem?.key];

        const selectedOffer = selectedGroup?.data?.offerDetails?.find((offer: any) => offer.offerKey?.includes(requiredOfferKey)) ?? null;
        dispatch(customerActions.setSelectedOffer({ ...selectedOffer, offerType: selectedGroup?.data?.offerType }));
        dispatch(customerActions.setAndroidUpgradeSelected(false));
        dispatch(commonAction.setBingFlag(selectedGroup?.data?.winbackFlexiOfferRechargeIdentifier));
      } else {
        dispatch(customerActions.setAndroidUpgradeSelected(false));
        dispatch(customerActions.setSelectedOffer(null));
      }
      onSelect(selectedGroup!.data[selectedItem.key]?.toString(), id);
    } else {
      onSelect('');
      dispatch(commonAction.setBingFlag(PROPERTIES.CUSTOMER_RECHARGE.N));
      dispatch(customerActions.setSelectedOffer(null));
    }
  };

  const showPlanInfo = (flexiPlanInfo: any) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.PARTNER_MARGIN,
        headerTitle: HEADER_TITLE.offerDetails,
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: {
          primaryButtonLabel: MODAL.OK,
          childKey: PROPERTIES.CUSTOMER_RECHARGE.FLEXI_PLAN_INFO,
          childData: flexiPlanInfo[0],
          centerLabel: true,
        },
      }),
    );
  };

  const showPlanDetails = (planInfo: ParentObject) => {
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.WINBACK_FLEXI_MARGIN,
        headerTitle: HEADER_TITLE.offerDetails,
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: {
          primaryButtonLabel: MODAL.OK,
          childData: planInfo,
          centerLabel: true,
        },
      }),
    );
  };

  useEffect(() => {
    dispatch(commonAction.setBingFlag(PROPERTIES.CUSTOMER_RECHARGE.N));
    dispatch(customerActions.setSelectedIdRadio(unSelectedValue ?? null));
  }, [unSelectedValue]);

  return (
    <View style={[styles.container, styles[gcs('container', inflection, true, ['lg', 'xl'])]]} testID="radio-container">
      {groups.map((group) => (
        <View key={group.heading} style={styles.groupContainer}>
          {group.heading && (
            <View style={styles.headerContainer}>
              {group.showIcon && !(group?.data?.flexiPlanInfo && group.heading === RADIO_GROUP.RechargeFlexiPlan) && (
                <Image iconName={ICONS.ALERT_INFO} height={Sizing.layout.x14} width={Sizing.layout.x14} isDimension={false} />
              )}
              {group?.data?.flexiPlanInfo && group.heading === RADIO_GROUP.RechargeFlexiPlan && (
                <TouchableOpacity onPress={() => showPlanInfo(group?.data?.flexiPlanInfoNew)} testID="info-icon-test">
                  <Image iconName={ICONS.DETAILS_INFO} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
                </TouchableOpacity>
              )}
              {group.heading === RADIO_GROUP.RechargeWinbackFlexi && (
                <TouchableOpacity
                  onPress={() => {
                    showPlanDetails(group?.data?.offerDetails);
                  }}
                  testID="info-icon-test"
                >
                  <Image iconName={ICONS.DETAILS_INFO} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
                </TouchableOpacity>
              )}
              <Text style={styles.headingText}>{t(`strings.${group.heading}`)}</Text>
            </View>
          )}
          {group.items.map((item) => (
            <View key={item.key}>
              {group?.data?.bingeOffer === PROPERTIES.CUSTOMER_RECHARGE.U && item.key === PROPERTIES.CUSTOMER_RECHARGE.BINGE_RECHARGE_VALUE ? (
                <DynamicRadioButton data={group.data} isSelected={selectedIdRadio === item.key} onPress={() => handleSelect(item.key)} />
              ) : (
                <RadioButton item={item} subItems={item.subItems} data={group.data} isSelected={selectedIdRadio === item.key} onPress={() => handleSelect(item.key)} />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default RadioGroup;
