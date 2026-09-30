/**
 * this is the screen for shwing the action request details for fos role
 *
 * @module components/ActionRequestPo
 * @memberof - View Component
 */
import React, { memo, useState, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { gcs } from 'styles/webBreakpoints';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import { Button, List, Search, Text, TextContainer } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import { ICONS, PROPERTIES, QUERY, STYLES } from 'const';
import { Sizing } from 'styles';
import { callAction } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import { formatDate } from 'utils/dateHelper';
import styles from './ActionRequestPo.styles';

/**
 * Component prop types.
 *
 * @typedef {object} ActionRequestPoProps
 * @property {string} [text] - The text to display inside the component.
 */
export type ActionRequestPoProps = {
  text?: string;
};

/**
 * Represents a ActionRequestPo component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const ActionRequestPo = () => {
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const { actionRequestTableData } = useSelector((state: RootState) => state.purchaseOrder);
  const [filteredData, setFilteredData] = useState(actionRequestTableData);
  const { goBack } = useNavigate();
  const { t } = useTranslation();
  const headerColumn = Sizing.layout.x5;
  const keysArray = PROPERTIES.PURCHASE_ORDER.ACTION_REQUEST_HEADER;

  useEffect(() => {
    if (actionRequestTableData?.length > 0) {
      setFilteredData(actionRequestTableData);
    } else {
      setFilteredData([]);
    }
  }, [actionRequestTableData]);

  useEffect(() => {
    let result = actionRequestTableData;
    if (!searchQuery?.trim()) {
      setFilteredData(result);
      return;
    }
    const query = searchQuery.trim().toLowerCase();
    result = result?.filter((item: ParentObject) => item.nameNT?.toLowerCase()?.includes(query) || item.mdnNT?.includes(query) || item.amountNT.toLowerCase()?.includes(query));
    setFilteredData(result);
  }, [searchQuery, actionRequestTableData]);

  const backHandler = () => {
    goBack();
  };

  const approveRequest = (data: ParentObject) => {
    const params = {
      input: {
        amount: data?.amount,
        id: data?.id,
        mobSource: 'MOBWEB',
        status: data?.statusNT,
        transacteeAccountId: data?.transactee_account_id,
        transactorAccountId: data?.transactor_account_id,
      },
    };
    dispatch(callAction({ ...params }, QUERY.FosApproveRequest));
  };

  const rejectRequest = (data: ParentObject) => {
    dispatch(callAction({ ...data }, QUERY.GetFosRejectionReasonFromProperty));
  };

  const partnerApprovalCard = (listData: ParentObject) => {
    const keyMap = {
      dealerName: listData.name,
      evdNumber: listData.mdn,
      transferredAmount: listData.amount,
      requestDate: formatDate(listData.request_date),
    };
    const filteredData = Object.entries(keyMap).map(([key, value]) => ({
      key,
      value,
    }));
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
                  onPress={() => rejectRequest(listData)}
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
                  onPress={() => approveRequest(listData)}
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
              data={keyMap}
              dataArray={PROPERTIES.PURCHASE_ORDER.ACTION_CARD_DETAILS}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            label={t('strings.reject')}
            type={STYLES.TYPE.SECONDARY}
            onPress={() => rejectRequest(listData)}
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
            onPress={() => approveRequest(listData)}
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

        {actionRequestTableData?.length > 0 && inflectionWeb && (
          <View style={styles.listHeader}>
            <List
              key="header-list"
              data={keysArray}
              numColumns={headerColumn}
              columnWrapperStyle={[styles.subColumnWrapper, { borderBottomWidth: 0 }]}
              renderItem={({ item, index }) => (
                <View key={`header-${item}-${index}`} style={[styles.tableContainerHeader, { borderRightWidth: index === keysArray.length - 1 ? 0 : 1 }]}>
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
            <List key="partner-list" data={filteredData} renderItem={({ item }) => partnerApprovalCard(item)} removeClippedSubviews={false} />
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

export default memo(ActionRequestPo);
