/**
 * This is partner approval card with approve and reject buttons with partner details
 *
 * @module components/PartnerApprovalCard
 * @memberof CommonComponent
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import TextContainer from 'components/sales/TextContainer';
import Button from 'components/sales/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { CHILD_TYPE, HEADER_TITLE, ICONS, MODAL, PROPERTIES, STRINGS, STYLES } from 'const';
import { Colors, Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { ParentObject } from 'store/sales/types/common';
import List from 'components/sales/List';
import uiActions from 'store/sales/actions/ui';
import formAction from 'store/sales/actions/form';
import Text from 'components/sales/Text';
import styles from './PartnerApprovalCard.styles';

/**
 * Component type definitions
 *
 * @typedef {object} PartnerApprovalCardProps
 * @property {string} [text] - The content for the component
 */

export type PartnerApprovalCardProps = {
  queryName?: string;
};

/**
 * Represents a PartnerApprovalCard component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered PartnerApprovalCard component
 *
 * @example
 * <PartnerApprovalCard text="Hello World!" />
 */

const PartnerApprovalCard = ({ queryName }: PartnerApprovalCardProps) => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const { evdMdnPartnerFilteredList } = useSelector((state: RootState) => state.evdMdnChange);
  const dispatch = useDispatch<AppDispatch>();
  const headerColumn = 7;
  const keysArray = PROPERTIES.EVD_MDN_CHANGE_DETAILS.evdMdnChangeHeader;

  const handleApprove = (item: ParentObject, type: string) => {
    dispatch(
      formAction.setEvdMdnNavigationData({
        partnerName: item.partnerName,
        partnerId: item.partnerId,
        oldRmn: item.oldRmn,
        newRmn: item.newRmn,
        type: STRINGS.REJECTED,
        requestId: item.requestId,
        mdnStatus: STRINGS.REJECTED_CAPS,
      }),
    );
    const payload = {
      input: {
        partnerName: item.partnerName,
        partnerId: item.partnerId,
        oldRmn: item.oldRmn,
        newRmn: item.newRmn,
        type: type === STRINGS.MDN_CHANGE_APPROVE ? STRINGS.APPROVED : STRINGS.REJECTED,
        reason: item.reason,
        requestId: item.requestId,
        mdnStatus: STRINGS.APPROVED_CAPS,
      },
    };
    dispatch(
      uiActions.showBottomModal({
        isModalVisible: true,
        type: CHILD_TYPE.LABEl,
        headerTitle: HEADER_TITLE.CONFIRMATION,
        showCloseIcon: true,
        showHeader: true,
        buttonInfo: {
          primaryButtonLabel: type === STRINGS.MDN_CHANGE_APPROVE ? MODAL.YES_APPROVE : MODAL.REJECT,
          secondaryButtonLabel: MODAL.CANCEL,
          queryName,
          queryParams: { ...payload, actionType: type },
          childData: type,
          hasOutline: true,
        },
      }),
    );
  };

  const renderListData = (listData: ParentObject) => {
    const data = Object.entries(listData).map(([key, value]) => ({
      key,
      value,
    }));
    // Filter and map the data to return an array of key-value pairs
    const filteredData = keysArray
      .map((key) => {
        // Find the item in data with the matching key
        const item = data.find((d) => d.key === key);
        return item ? { key: item.key, value: item.value } : null; // Return object or null if not found
      })
      .filter((item) => item !== null); // Remove any null entries if no match was found
    filteredData.push({ key: PROPERTIES.EVD_MDN_CHANGE_DETAILS.tableHeaderAction, value: '' });

    return inflection === BreakPoints.LG || inflection === BreakPoints.MD || inflection === BreakPoints.XL ? (
      <List
        key={headerColumn}
        data={filteredData}
        numColumns={headerColumn}
        columnWrapperStyle={[styles.subColumnWrapper]}
        renderItem={({ item, index }) => (
          <View style={[styles.tableContainer, { borderRightWidth: index === filteredData.length - 1 ? 0 : 1 }]}>
            <View style={styles.row}>
              <Text label={item.value} style={[styles.cell, styles[item.key]]} />
            </View>
            {index === filteredData.length - 1 && (
              <View style={styles.buttonContainer}>
                <Button
                  fontSize={Sizing.layout.x12}
                  style={[styles.primaryButtonStyle, styles[gcs('primaryButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
                  label={t('strings.approve')}
                  onPress={() => handleApprove(listData, STRINGS.MDN_CHANGE_APPROVE)}
                  iconName={ICONS.SELECTION}
                  iconHeight={Sizing.layout.x18}
                  iconWidth={Sizing.layout.x18}
                  iconPosition={STYLES.POSITION.LEFT}
                  isDimension={false}
                />
                <Button
                  fontSize={Sizing.layout.x12}
                  style={[styles.primaryButtonStyle, styles[gcs('primaryButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
                  label={t('strings.reject')}
                  onPress={() => handleApprove(listData, STRINGS.MDN_CHNAGE_REJECT)}
                  type={STYLES.TYPE.SECONDARY}
                  outline
                  fontColor={Colors.neutral.black}
                  iconName={ICONS.REJECT}
                  iconHeight={Sizing.layout.x18}
                  iconWidth={Sizing.layout.x18}
                  iconPosition={STYLES.POSITION.LEFT}
                  isDimension={false}
                />
              </View>
            )}
          </View>
        )}
      />
    ) : (
      <View style={[styles.container, styles[gcs('container', inflection, true, ['lg', 'xl'])]]} testID="partnerApprovalTest">
        <TextContainer
          textContainerStyle={styles.textContainerStyle}
          itemContainerStyle={styles.itemContainerStyle}
          primaryStyle={styles.primaryTextStyle}
          secondaryStyle={styles.secondaryTextStyle}
          dataArray={PROPERTIES.EVD_MDN_CHANGE_DETAILS.evdMdnChange}
          data={listData}
        />
        <View style={styles.buttonContainer}>
          <Button
            fontSize={Sizing.layout.x14}
            style={[styles.primaryButtonStyle, styles[gcs('primaryButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            label={t('strings.approve')}
            onPress={() => handleApprove(listData, STRINGS.MDN_CHANGE_APPROVE)}
            iconName={ICONS.SELECTION}
            iconHeight={Sizing.layout.x24}
            iconWidth={Sizing.layout.x24}
            iconPosition={STYLES.POSITION.LEFT}
            isDimension={false}
          />
          <Button
            fontSize={Sizing.layout.x14}
            style={[styles.primaryButtonStyle, styles[gcs('primaryButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            label={t('strings.reject')}
            onPress={() => handleApprove(listData, STRINGS.MDN_CHNAGE_REJECT)}
            type={STYLES.TYPE.SECONDARY}
            outline
            fontColor={Colors.neutral.black}
            iconName={ICONS.REJECT}
            iconHeight={Sizing.layout.x24}
            iconWidth={Sizing.layout.x24}
            iconPosition={STYLES.POSITION.LEFT}
            isDimension={false}
          />
        </View>
      </View>
    );
  };

  const numberOfColumns = useMemo(() => {
    switch (inflection) {
      case BreakPoints.LG:
        return 2;

      case BreakPoints.XL:
        return 3;

      default:
        return 1;
    }
  }, [inflection]);

  const TableRow = ({ item, column }: ParentObject) => <Text style={[styles.headerCell, styles[column]]} label={item ? t(`strings.${item}`) : ''} />;
  const inflectionWeb = inflection === BreakPoints.LG || inflection === BreakPoints.MD || inflection === BreakPoints.XL;
  return (
    <View testID="partnerApprovalTest">
      {evdMdnPartnerFilteredList?.length > 0 && inflectionWeb && (
        <View style={styles.listHeader}>
          <List
            key={headerColumn}
            data={keysArray}
            numColumns={headerColumn}
            columnWrapperStyle={[styles.subColumnWrapper, { borderBottomWidth: 0 }]}
            renderItem={({ item, index }) => (
              <View style={[styles.tableContainer, { borderRightWidth: index === keysArray.length - 1 ? 0 : 1 }]}>
                <View style={styles.headerRow}>
                  <TableRow item={item} column={`${item}H`} />
                  {index !== keysArray.length - 1 && <Text label="" />} {/* Only show blank Text for non-last items */}
                </View>
              </View>
            )}
          />
        </View>
      )}

      {evdMdnPartnerFilteredList?.length > 0 ? (
        <View>
          <List key={numberOfColumns} data={evdMdnPartnerFilteredList} renderItem={({ item }) => renderListData(item)} style={styles.listData} />
        </View>
      ) : (
        <Text style={styles.alignCenter} label={t('errors.noDataFound')} />
      )}
    </View>
  );
};

export default PartnerApprovalCard;
