/**
 * This screen will be used for purchase order home screen
 *
 * @module components/PurchaseOrderHome
 * @memberof - View Component
 */
import React, { memo, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, GroupedActionTiles } from 'components/sales';
import { Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { SUBMISSION } from 'const';
import { PARTNER_ROLES, QUERY, ROUTE } from 'const/strings';
import { callAction } from 'utils/formBuilderHelper';
import { ParentObject } from 'store/sales/types/common';
import styles from './PurchaseOrderHome.styles';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';

/**
 * Represents a PurchaseOrderHome component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const PurchaseOrderHome = () => {
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const dispatch = useDispatch<AppDispatch>();
  const { goBack, navigate } = useNavigate();
  const { info, isRedirection } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_PageVisit.moduleName, {
      [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_PageVisit.attributes.Status]: true,
    });
  }, []);

  const handleSubmit = (submitType: string, queryName: string, routeName: string) => {
    switch (submitType) {
      case SUBMISSION.SUBMIT_NAVIGATION:
        if (routeName === ROUTE.WEB.EVD_RAISE_REQUEST) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_RaiseEVDRequest.moduleName, {
            [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_RaiseEVDRequest.attributes.Status]: true,
          });
        }
        if (routeName === ROUTE.WEB.MATERIAL_RAISE_REQUEST) {
          MoengageMixpanel.trackEvent(MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_RaisePOSM.moduleName, {
            [MoengageMixpanelModules.PurchaseOrder.PurchaseOrder_RaisePOSM.attributes.Status]: true,
          });
        }
        dispatch(callAction({}, queryName));
        navigate(routeName);
        break;
      case SUBMISSION.SUBMIT:
        dispatch(callAction({}, queryName, '', navigate));
        break;

      default:
        break;
    }
  };

  const dealerTiles = [
    {
      title: t('strings.raiseRequest'),
      iconName: 'RAISE_REQUEST_PO',
      onPress: undefined,
      subTiles: [
        { label: 'evd', iconName: '', submitType: SUBMISSION.SUBMIT_NAVIGATION, queryName: QUERY.DoPosmBalanceEnquiryWeb, routeName: ROUTE.WEB.EVD_RAISE_REQUEST },
        { label: 'materials', iconName: '', submitType: SUBMISSION.SUBMIT_NAVIGATION, queryName: QUERY.DoPosmBalanceEnquiryWeb, routeName: ROUTE.WEB.MATERIAL_RAISE_REQUEST },
      ],
    },
    {
      title: t('strings.trackRequest'),
      iconName: 'TRACK_REQUEST_OLD',
      onPress: undefined,
      subTiles: [
        { label: 'evd', iconName: '', submitType: SUBMISSION.SUBMIT, routeName: null, queryName: QUERY.OpenEVDFormDealer, queryParams: null },
        { label: 'materials', iconName: '', submitType: SUBMISSION.SUBMIT, routeName: null, queryName: QUERY.OpenMaterialsFormDealer, queryParams: null },
      ],
    },
  ];

  const distributorTiles = [
    {
      title: t('strings.trackRequest'),
      iconName: 'TRACK_REQUEST_OLD',
      onPress: undefined,
      subTiles: [
        { label: 'evd', iconName: '', submitType: SUBMISSION.SUBMIT, routeName: null, queryName: QUERY.OpenEVDForm, queryParams: null },
        { label: 'materials', iconName: '', submitType: SUBMISSION.SUBMIT, routeName: null, queryName: QUERY.OpenMaterialsForm, queryParams: null },
      ],
    },

    { title: t('strings.walletOptions'), iconName: 'WALLET_OPTIONS', onPress: () => handleSubmit(SUBMISSION.SUBMIT, QUERY.WalletOptions, ''), subTiles: [] },

    { title: t('strings.settlements'), iconName: 'SETTLEMENTS', onPress: () => handleSubmit(SUBMISSION.SUBMIT, QUERY.NavigateSettlements, ''), subTiles: [] },
  ];

  const FOSTiles = [
    {
      title: t('strings.actionRequest'),
      iconName: 'ACTION_REQUEST_PO',
      onPress: () => handleSubmit(SUBMISSION.SUBMIT, QUERY.GetPosmDealerId1, ''),
      subTiles: [],
    },

    {
      title: t('strings.trackRequest'),
      iconName: 'TRACK_REQUEST_OLD',
      onPress: undefined,
      subTiles: [
        { label: 'evd', iconName: '', submitType: SUBMISSION.SUBMIT, routeName: null, queryName: QUERY.OpenEVDFormFos, queryParams: null },
        { label: 'materials', iconName: '', submitType: SUBMISSION.SUBMIT, routeName: null, queryName: QUERY.OpenMaterialsFormFos, queryParams: null },
      ],
    },
  ];
  const ASMTiles = [
    {
      title: t('strings.trackRequest'),
      iconName: 'TRACK_REQUEST_OLD',
      onPress: undefined,
      subTiles: [
        { label: 'evd', iconName: '', submitType: SUBMISSION.SUBMIT, routeName: null, queryName: QUERY.OpenEVDFormASM, queryParams: null },
        { label: 'materials', iconName: '', submitType: SUBMISSION.SUBMIT, routeName: null, queryName: QUERY.OpenMaterialsFormASM, queryParams: null },
      ],
    },
  ];

  return (
    <View style={styles.flex} testID="purchase-order-home">
      <ScrollView nestedScrollEnabled style={[styles.partnerScreen, styles[gcs('partnerScreen', inflection, true, ['md', 'lg', 'xl'])]]}>
        <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
          {info?.roleId === PARTNER_ROLES.dealer &&
            dealerTiles?.map((item: ParentObject) => (
              <GroupedActionTiles
                title={item.title}
                iconName={item.iconName}
                onPress={item?.onPress}
                subTiles={item?.subTiles?.map((tile: any) => ({
                  label: t(`strings.${tile.label}`),
                  iconName: tile.iconName,
                  onPress: () => handleSubmit(tile?.submitType, tile.queryName, tile.routeName),
                }))}
              />
            ))}
          {info?.roleId === PARTNER_ROLES.dis &&
            distributorTiles?.map((item: ParentObject) => (
              <GroupedActionTiles
                title={item.title}
                iconName={item.iconName}
                onPress={item?.onPress}
                subTiles={item?.subTiles?.map((tile: any) => ({
                  label: t(`strings.${tile.label}`),
                  iconName: tile.iconName,
                  onPress: () => handleSubmit(tile?.submitType, tile.queryName, tile.routeName),
                }))}
              />
            ))}
          {info?.roleId === PARTNER_ROLES.fos &&
            FOSTiles?.map((item: ParentObject) => (
              <GroupedActionTiles
                title={item.title}
                iconName={item.iconName}
                onPress={item?.onPress}
                subTiles={item?.subTiles?.map((tile: any) => ({
                  label: t(`strings.${tile.label}`),
                  iconName: tile.iconName,
                  onPress: () => handleSubmit(tile?.submitType, tile.queryName, tile.routeName),
                }))}
              />
            ))}

          {(info?.roleId === PARTNER_ROLES.ASM || info?.roleId === PARTNER_ROLES.ASI || info?.roleId === PARTNER_ROLES.CSM) &&
            ASMTiles?.map((item: ParentObject) => (
              <GroupedActionTiles
                title={item.title}
                iconName={item.iconName}
                onPress={item?.onPress}
                subTiles={item?.subTiles?.map((tile: any) => ({
                  label: t(`strings.${tile.label}`),
                  iconName: tile.iconName,
                  onPress: () => handleSubmit(tile?.submitType, tile.queryName, tile.routeName),
                }))}
              />
            ))}
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          type="secondary"
          outline
          fontSize={Sizing.layout.x16}
          label={t('strings.back')}
          isDimension={false}
          onPress={() => goBack(isRedirection)}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </View>
  );
};

export default memo(PurchaseOrderHome);
