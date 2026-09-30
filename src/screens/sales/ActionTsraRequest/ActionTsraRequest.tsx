/**
 * Action TSRA Request screen for the mSales application
 *
 * @module components/ActionTsraRequest
 * @memberof - View Component
 */
import React, { memo, useEffect, useState, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { Button, Image, List, Search, Text, TextContainer } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import { ParentObject } from 'store/sales/types/common';
import { itemType } from 'components/sales/TextContainer';
import { ICONS, PROPERTIES, STYLES } from 'const';
import useNavigate from 'hooks/useNavigate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { QUERY, ROUTE, STRINGS } from 'const/strings';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import styles from './ActionTsraRequest.styles';

/**
 * Represents a ActionTsraRequest component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const ActionTsraRequest = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const { tsraApprovalListData } = useSelector((state: RootState) => state.tsraApproval);
  const [filteredData, setFilteredData] = useState(tsraApprovalListData?.result?.dataList);

  const keysArray = PROPERTIES.TSRA_APPROVAL.partnerApprovalHeader;
  const headerColumn = Sizing.layout.x5;

  useEffect(() => {
    dispatch(callAction({}, QUERY.GetTSRAApprovalList));
  }, []);

  useEffect(() => {
    let result = tsraApprovalListData?.result?.dataList;
    if (searchQuery?.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result?.filter(
        (item: ParentObject) =>
          item.tsraMobileNumber.toLowerCase()?.includes(query) || item.tsraNameNT.toLowerCase()?.includes(query) || item.createdDateNT.toLowerCase()?.includes(query),
      );
      setFilteredData(result);
    } else {
      setFilteredData(result);
    }
  }, [searchQuery, tsraApprovalListData]);

  const showPartnerDetails = (data: ParentObject, selectedTab: string) => {
    if (selectedTab === STRINGS.REJECT) {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.TsraApproval.ActionTSRARequest_Reject.moduleName, {
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_Reject.attributes.Status]: true,
      });
    }
    if (selectedTab === STRINGS.APPROVE) {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.TsraApproval.ActionTSRARequest_Approve.moduleName, {
        [MoengageMixpanelModules.TsraApproval.ActionTSRARequest_Approve.attributes.Status]: true,
      });
    }
    navigate(ROUTE.WEB.ACTION_TSRA_SUMMARY, { selectedTab });
    dispatch(callAction(data, QUERY.SetSelectedDealer));
    return data;
  };

  const backHandler = () => {
    goBack();
  };

  const partnerApprovalCard = (listData: ParentObject) => {
    const data = Object.entries(listData).map(([key, value]) => ({
      key,
      value,
    }));
    // Filter and map the data to return an array of key-value pairs
    const filteredData = keysArray
      .map((key: string) => {
        // Find the item in data with the matching key
        const item = data.find((d) => d.key === key);
        return item ? { key: item.key, value: item.value } : null; // Return object or null if not found
      })
      .filter((item: { key: string; value: string }) => item !== null); // Remove any null entries if no match was found
    filteredData.push({ key: PROPERTIES.PARTNER_APPROVAL.tableHeaderAction, value: '' });

    return inflection === BreakPoints.LG || inflection === BreakPoints.MD || inflection === BreakPoints.XL ? (
      <View key={listData.key} style={[styles.subColumnWrapper]}>
        {filteredData.map((item: { key: string; value: string }, index) => (
          <View key={`${item?.key}}`} style={[styles.tableContainer, { borderRightWidth: index === filteredData.length - 1 ? 0 : 1 }, styles[item.key]]}>
            <View style={styles.row}>
              <Text label={item?.value} style={[styles.cell]} />
            </View>
            {index === filteredData.length - 1 && (
              <View style={styles.tableButtonContainer}>
                <Button
                  style={[styles.primaryButtonStyle, styles[gcs('primaryButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
                  label={t('strings.reject')}
                  type={STYLES.TYPE.SECONDARY}
                  onPress={() => showPartnerDetails(listData, STRINGS.REJECT)}
                  outline
                  fontSize={Sizing.layout.x16}
                  iconName={ICONS.CLOSE_VIOLET}
                  iconPosition={STYLES.POSITION.LEFT}
                  iconHeight={Sizing.layout.x1Dot5}
                  iconWidth={Sizing.layout.x1Dot5}
                  iconStyle={styles.secondaryIconStyle}
                />
                <Button
                  style={[styles.primaryButtonStyle, styles[gcs('primaryButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
                  label={t('strings.approve')}
                  type={STYLES.TYPE.PRIMARY}
                  onPress={() => showPartnerDetails(listData, STRINGS.APPROVE)}
                  fontSize={Sizing.layout.x16}
                  iconName={ICONS.CHECKMARK}
                  iconPosition={STYLES.POSITION.LEFT}
                  iconHeight={Sizing.layout.x1Dot5}
                  iconWidth={Sizing.layout.x1Dot5}
                  iconStyle={styles.primaryIconStyle}
                />
              </View>
            )}
          </View>
        ))}
      </View>
    ) : (
      <View key={listData.key} style={styles.cardContainer}>
        <View style={styles.textContainer}>
          <View style={styles.textContainerSmall}>
            <TextContainer
              itemContainerStyle={styles.textWrapper}
              primaryStyle={styles.primaryText}
              secondaryStyle={styles.secondaryText}
              data={listData}
              dataArray={PROPERTIES.TSRA_APPROVAL.APPROVAL_CARD_DETAILS as itemType[]}
            />
          </View>
          <Pressable onPress={() => showPartnerDetails(listData, STRINGS.APPROVE)} style={styles.imageStyle}>
            <Image iconName={ICONS.PINK_CHEVRON_RIGHT} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            label={t('strings.reject')}
            type={STYLES.TYPE.SECONDARY}
            onPress={() => showPartnerDetails(listData, STRINGS.REJECT)}
            outline
            fontSize={Sizing.layout.x16}
            iconName={ICONS.CLOSE_VIOLET}
            iconPosition={STYLES.POSITION.LEFT}
            iconHeight={Sizing.layout.x1Dot5}
            iconWidth={Sizing.layout.x1Dot5}
            iconStyle={styles.secondaryIconStyle}
          />
          <Button
            style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            label={t('strings.approve')}
            type={STYLES.TYPE.PRIMARY}
            onPress={() => showPartnerDetails(listData, STRINGS.APPROVE)}
            fontSize={Sizing.layout.x16}
            iconName={ICONS.CHECKMARK}
            iconPosition={STYLES.POSITION.LEFT}
            iconHeight={Sizing.layout.x1Dot5}
            iconWidth={Sizing.layout.x1Dot5}
            iconStyle={styles.primaryIconStyle}
          />
        </View>
      </View>
    );
  };

  const TableRow = ({ item, column }: ParentObject) => <Text style={[styles.headerCell, styles[column]]} label={item ? t(`strings.${item}`) : ''} />;

  const inflectionWeb = useMemo(() => inflection === BreakPoints.LG || inflection === BreakPoints.MD || inflection === BreakPoints.XL, [inflection]);

  return (
    <>
      <View style={[styles.partnerScreen, styles[gcs('partnerScreen', inflection, true, ['md', 'lg', 'xl'])]]}>
        <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Search placeholder={t('strings.search')} searchStyles={styles.minWidthContainer} value={searchQuery} onChange={setSearchQuery} />
        </View>
        {tsraApprovalListData?.result?.dataList?.length > 0 && inflectionWeb && (
          <View style={styles.listHeader}>
            <List
              key="header-list"
              data={keysArray}
              numColumns={headerColumn}
              columnWrapperStyle={[styles.subColumnWrapper, { borderBottomWidth: 0 }]}
              renderItem={({ item, index }) => (
                <View key={`header-${item}-${index}`} style={[styles.tableContainer, { borderRightWidth: index === keysArray.length - 1 ? 0 : 1 }]}>
                  <View style={styles.headerRow}>
                    <TableRow item={item} column={`${item}H`} />
                    {index !== keysArray.length - 1 && <Text label="" />}
                  </View>
                </View>
              )}
            />
          </View>
        )}
        {filteredData?.length > 0 ? (
          <View style={[styles.listContainer, styles[gcs('listContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <List
              key="partner-list"
              data={filteredData}
              renderItem={({ item }) => partnerApprovalCard(item)}
              removeClippedSubviews={false} // This can help with nested list issues
            />
          </View>
        ) : (
          <Text style={styles.alignCenter} label={t('errors.noDataFound')} />
        )}
      </View>
      <View style={styles.backButton}>
        <Button
          type={STYLES.TYPE.SECONDARY}
          outline
          style={[styles.backButtonStyle, styles[gcs('backButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
          onPress={() => backHandler()}
          label={t('strings.cancel')}
        />
      </View>
    </>
  );
};

export default memo(ActionTsraRequest);
