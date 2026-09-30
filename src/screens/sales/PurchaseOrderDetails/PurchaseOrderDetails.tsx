/**
 * In this screen user can see the details they have for a perticular dealer
 *
 * @module components/PurchaseOrderDetails
 * @memberof - View Component
 */
import React, { memo, useMemo, useState } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { QUERY, ROUTE } from 'const';
import { Button, DynamicTable, Search, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { Sizing } from 'styles';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import useNavigate from 'hooks/useNavigate';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { ParentObject } from 'store/sales/types/common';
import { callAction } from 'utils/formBuilderHelper';
import styles from './PurchaseOrderDetails.styles';

/**
 * Component prop types.
 *
 * @typedef {object} PurchaseOrderDetailsProps
 * @property {string} [text] - The text to display inside the component.
 */
export type PurchaseOrderDetailsProps = {
  text?: string;
};

/**
 * Represents a PurchaseOrderDetails component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const PurchaseOrderDetails = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const { routeName } = useCurrentRoute();
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [orderIdSelected, setOrderIdSelected] = useState<ParentObject>();
  const { tableFilteredData } = useSelector((state: RootState) => state.common);
  const { tableColumn, detailsColumn } = useSelector((state: RootState) => state.purchaseOrder);

  const filteredProductDetails = useMemo(
    () => orderIdSelected?.productDetails?.filter((item: ParentObject) => item.requestedQty?.trim() !== '' || Number(item.confirmedQty) > 0),
    [orderIdSelected?.productDetails],
  );

  const handleAssetdetails = (item: ParentObject) => {
    dispatch(callAction({ productName: item?.productName, orderNumber: orderIdSelected?.orderNumber }, QUERY.DoGetPOSMAssetDetails));
  };

  const handleSubmit = () => {
    switch (routeName) {
      case ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS:
        navigate(ROUTE.WEB.PURCHASE_ORDER_DURATION);
        break;
      case ROUTE.WEB.PURCHASE_ORDER_DEALER_TRACK_DETAILS:
        navigate(ROUTE.WEB.PURCHASE_ORDER_DEALER_DURATION);
        break;
      case ROUTE.WEB.PURCHASE_ORDER_FOS_TRACK_DETAILS:
        navigate(ROUTE.WEB.PURCHASE_ORDER_FOS_DURAION);
        break;
      default:
        navigate(ROUTE.WEB.PURCHASE_ORDER_REQUEST);
    }
  };

  let searchQueryName = '';

  switch (routeName) {
    case ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_POSM:
      searchQueryName = QUERY.SearchPoTrackDetailsPOSM;
      break;

    case ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS:
      searchQueryName = QUERY.SearchPoTrackDetails;
      break;

    case ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_DEALER_POSM:
      searchQueryName = QUERY.SearchPoTrackDetailsPOSM;
      break;

    case ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_FOS_POSM:
      searchQueryName = QUERY.SearchPoTrackDetailsPOSM;
      break;

    case ROUTE.WEB.PURCHASE_ORDER_TRACK_DETAILS_ASM_POSM:
      searchQueryName = QUERY.SearchPoTrackDetailsPOSM;
      break;

    default:
      searchQueryName = QUERY.SearchPoTrackDetails;
  }

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
          <View style={styles.searchContainer}>
            <Search queryName={searchQueryName} placeholder="Search..." />
          </View>
        </View>
        <View style={styles.alignItemCenter}>
          {tableFilteredData?.length > 0 ? (
            <DynamicTable columns={tableColumn} data={tableFilteredData} onLinkPress={setOrderIdSelected} />
          ) : (
            <Text style={styles.alignCenter} label={t('errors.noDataFound')} />
          )}
        </View>
        {orderIdSelected && (
          <View style={styles.alignItemCenterSpace}>
            <DynamicTable columns={detailsColumn} data={filteredProductDetails || []} onLinkPress={handleAssetdetails} />
          </View>
        )}
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          type="secondary"
          outline
          fontSize={Sizing.layout.x16}
          label={t('modal.ok')}
          isDimension={false}
          onPress={() => handleSubmit()}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(PurchaseOrderDetails);
