/**
 * Action Partner Request screen for the mSales application
 *
 * @module components/ActionPartnerRequest
 * @memberof - View Component
 */
import React, { memo, useEffect, useState, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { Button, Dropdown, Image, List, Search, Text, TextContainer } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { Colors, Sizing } from 'styles';
import uiActions from 'store/sales/actions/ui';
import { ParentObject } from 'store/sales/types/common';
import { itemType } from 'components/sales/TextContainer';
import actions from 'store/sales/actions/partnerApproval';
import { ICONS, PROPERTIES, QUERY, ROUTE, STYLES } from 'const';
import useNavigate from 'hooks/useNavigate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import { PARTNER_ROLES, STRINGS } from 'const/strings';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './ActionPartnerRequest.styles';
// import { useDebounce } from 'hooks/useDebounce';

/**
 * Represents a ActionPartnerRequest component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const ActionPartnerRequest = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const { dropDownListAndRejectReasons, partnerList, initialData } = useSelector((state: RootState) => state.partnerApproval);
  const { info } = useSelector((state: RootState) => state.user);
  const [selectedDropDownValue, setSelectedDropDownValue] = useState<{ name: string; value: string }>();
  const [filteredData, setFilteredData] = useState(partnerList);

  const keysArray = PROPERTIES.PARTNER_APPROVAL.partnerApprovalHeader;
  const headerColumn = Sizing.layout.x6;

  useEffect(() => {
    dispatch(uiActions.clearLoader());
    if (selectedDropDownValue) {
      dispatch(callAction({ ...selectedDropDownValue }, QUERY.GetDropDownListAndRejectReasons));
    }
  }, [selectedDropDownValue]);

  useEffect(() => {
    dispatch(callAction({}, QUERY.GetDropDownListAndRejectReasons)).then((res: ParentObject) => {
      dispatch(callAction(res, QUERY.SetInitialData));
    });
  }, []);

  useEffect(() => {
    if (partnerList?.length > 0) {
      const sortedData = [...partnerList].sort((a: ParentObject, b: ParentObject) => new Date(b.createdDateNT).getTime() - new Date(a.createdDateNT).getTime());
      setFilteredData(sortedData);
    } else {
      setFilteredData([]);
    }
  }, [partnerList]);

  useEffect(() => {
    let result = partnerList;
    if (searchQuery?.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result?.filter(
        (item: ParentObject) =>
          item?.partnerNameNT?.toLowerCase()?.includes(query) ||
          String(item?.mobileNumber)?.includes(query) ||
          item?.role?.toLowerCase()?.includes(query) ||
          item?.outletTypeNT?.toLowerCase()?.includes(query) ||
          item?.createdDateNT?.toLowerCase()?.includes(query),
      );
      const sortedData = [...result].sort((a: ParentObject, b: ParentObject) => new Date(b.createdDateNT).getTime() - new Date(a.createdDateNT).getTime());
      setFilteredData(sortedData);
    } else {
      let sortedData = [];
      if (partnerList?.length > 0) {
        sortedData = [...partnerList].sort((a: ParentObject, b: ParentObject) => new Date(b.createdDateNT).getTime() - new Date(a.createdDateNT).getTime());
      }
      setFilteredData(sortedData);
    }
  }, [searchQuery, partnerList]);

  const approvePartner = (params: ParentObject) => {
    dispatch(callAction({ ...params }, QUERY.ApprovalConfirmation));
  };

  const rejectPartner = (params: ParentObject) => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PartnerApproval.PartnerApproval_Reject.moduleName, {
      [MoengageMixpanelModules.PartnerApproval.PartnerApproval_Reject.attributes.Status]: true,
    });
    dispatch(callAction({ ...params }, QUERY.RejectPartnerApproval));
  };

  const showPartnerDetails = (data: ParentObject) => {
    dispatch(actions.setSelectedPartner(data));
    navigate(ROUTE.WEB.PARTNER_APPROVAL_DETAILS);
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
        if (key === STRINGS.ROLE_OUTLET_TYPE) {
          const role = listData.role ?? '';
          const outletType = listData.outletType ?? '';
          return { key, value: `${role}/${outletType}` };
        }
        if (key === STRINGS.MORE_DETAILS) {
          return { key, value: '' };
        }
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
            {item.key === STRINGS.MORE_DETAILS && (
              <Pressable onPress={() => showPartnerDetails(listData)} style={styles.imageStyle}>
                <Image iconName={ICONS.PINK_CHEVRON_DOWN} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
              </Pressable>
            )}
            {index === filteredData.length - 1 && (
              <View style={styles.tableButtonContainer}>
                <Button
                  style={[styles.primaryButtonStyle, styles[gcs('primaryButtonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
                  label={t('strings.reject')}
                  type={STYLES.TYPE.SECONDARY}
                  onPress={() => rejectPartner(listData)}
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
                  onPress={() => approvePartner(listData)}
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
              dataArray={PROPERTIES.PARTNER_APPROVAL.APPROVAL_CARD_DETAILS as itemType[]}
            />
          </View>
          <Pressable onPress={() => showPartnerDetails(listData)} style={styles.imageStyle}>
            <Image iconName={ICONS.PINK_CHEVRON_RIGHT} isDimension={false} width={Sizing.layout.x25} height={Sizing.layout.x25} style={styles.infoImage} />
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            label={t('strings.reject')}
            type={STYLES.TYPE.SECONDARY}
            onPress={() => rejectPartner(listData)}
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
            onPress={() => approvePartner(listData)}
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
          {(info?.roleId !== PARTNER_ROLES.CSM || (info?.roleId === PARTNER_ROLES.CSM && selectedDropDownValue)) && (
            <Search placeholder={t('strings.search')} searchStyles={styles.minWidthContainer} value={searchQuery} onChange={setSearchQuery} />
          )}
          {info?.roleId === PARTNER_ROLES.CSM && (
            <View style={styles.labelDropDownContainer}>
              <Dropdown
                placeholder={t(`strings.selectAsiAsm`)}
                placeholderTextColor={Colors.neutral.black}
                innerContainerStyle={styles.innerDropDown}
                data={dropDownListAndRejectReasons?.DropdownList || initialData?.result?.DropdownList}
                selectedValue={selectedDropDownValue}
                onSelect={(val: { name: string; value: string }) => setSelectedDropDownValue(val)}
                iconStyle={styles.dropdowniconStyle}
              />
            </View>
          )}
        </View>

        {partnerList?.length > 0 && inflectionWeb && (
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

export default memo(ActionPartnerRequest);
