/**
 * success screen for eTsk reg submission
 *
 * @module components/ETskRegSuccess
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import { Pressable, ScrollView, View, SafeAreaView } from 'react-native';
import { Button, CommonSuccess, CustomerDetailsCard, Image, Text } from 'components/sales';
import { useTranslation } from 'react-i18next';
import { ICONS, STYLES, ROUTE, STRINGS, QUERY } from 'const';
import { Colors, Outlines, Sizing } from 'styles';
import useNavigate from 'hooks/useNavigate';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import { gcs } from 'styles/webBreakpoints';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { getURLforInvoiceTransactions } from 'store/sales/actions/invoice/invoice.action';
import { sliceActions as activationStatusActions } from 'store/sales/reducer/activationStatus';
import { sliceActions as quoteActions } from 'store/sales/reducer/quotation';
import { callAction } from 'utils/formBuilderHelper';
import formActions from 'store/sales/actions/form';
import { PARTNER_ROLES, STATE_KEY } from 'const/strings';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './ETskRegSuccess.styles';

/**
 * Represents a ETskRegSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const ETskRegSuccess = () => {
  const { goHome, reset, navigate } = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { inflection } = useInflection();
  const { isRedirection, info } = useSelector((state: RootState) => state.user);
  const [showAscOptions, setShowAscOptions] = useState(true);
  const [iconName, setIconName] = useState('');
  const { routeName } = useCurrentRoute();

  const { successData } = useSelector((state: RootState) => state.etskRegSchedular);
  const { mobileNo, email, multiTvSubID } = useSelector((state: RootState) => state.quotation);
  const { paidPrice, boxTypeSelected, validatePacksSuccessData } = useSelector((state: RootState) => state.etskRegistration);
  const { dealerDetails } = useSelector((state: RootState) => state.form[STATE_KEY.FORM_STATE]);

  const moduleRouteHandler = (route: string) => {
    switch (route) {
      case ROUTE.WEB.RECHARGE_REVERSAL:
        dispatch(formActions.setFormDependentDefault({ transactionID: successData?.response?.transId ?? successData?.result?.transId }));
        break;
      case ROUTE.WEB.ACTIVATION_STATUS:
        dispatch(activationStatusActions.setSubIdFromNavigation(dealerDetails?.subscriberId));

        break;
      case ROUTE.WEB.WORK_ORDER_RECREATION:
        dispatch(formActions.setFormValues({ subscriberInfo: dealerDetails?.subscriberId }, STATE_KEY.MODAL_STATE));
        break;
      case ROUTE.WEB.BOX_TYPE_CHANGE:
        dispatch(formActions.setUpdatedFormFields({ subscriberInfo: dealerDetails?.subscriberId }, STATE_KEY.MODAL_STATE));
        break;

      default:
        break;
    }
    reset(route, isRedirection);
  };

  useEffect(() => {
    const icon = successData?.response?.transId || successData?.result?.transId ? ICONS.CONFIRM_SUCCESS : ICONS.WARNING_EXCLAMATION;

    setIconName(icon);
    if ((routeName === ROUTE.WEB.ETSK_REG_SUCCESS || routeName === ROUTE.WEB.ETSK_MULTI_TV_SUCCESS || routeName === ROUTE.WEB.ETSK_REPUSH_SUCCESS) && Number(paidPrice) === 0) {
      setIconName(ICONS.CONFIRM_SUCCESS);
    }
  }, [successData]);

  const handleDownloadInvoice = () => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationDownloadInvoice.moduleName, {
      [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationDownloadInvoice.attributes.Status]: true,
      [MoengageMixpanelModules.PrimaryRegistration.PrimaryRegistrationDownloadInvoice.attributes.transactionId]: successData?.response?.transId || successData?.result?.transId,
    });
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.RepushOrder.RepushOrderDownloadInvoice.moduleName, {
      [MoengageMixpanelModules.RepushOrder.RepushOrderDownloadInvoice.attributes.Status]: true,
      [MoengageMixpanelModules.RepushOrder.RepushOrderDownloadInvoice.attributes.transactionId]: successData?.response?.transId || successData?.result?.transId,
    });
    dispatch(getURLforInvoiceTransactions({ isisDownload: true, transactionId: successData?.response?.transId ?? successData?.result?.transId }));
  };

  const renderBoxTypes = (routeName: string, data: any) => {
    const startIndex = routeName === ROUTE.WEB.PRIMARY_TV_REG_SUCCESS || routeName === ROUTE.WEB.RE_PUSH_ORDER_SUCCESS ? 1 : 2;

    const boxTypes = Array.from({ length: 3 }, (_, idx) => {
      const key = `secondBoxType${idx + startIndex}`;
      return { key, value: data?.[key] };
    }).filter((item) => !!item.value);

    return boxTypes.map((item, idx) => (
      <Text key={item.key} style={[styles.secondaryTextStyle, styles.divider, { borderRightWidth: idx < boxTypes.length - 1 ? Outlines.borderWidth.thin : 0 }]}>
        {item.value}
      </Text>
    ));
  };

  const handleRegister = () => {
    if (routeName === ROUTE.WEB.QUOTATION_MULTITV_SUCCESS) {
      dispatch(quoteActions.quotationsetMultiTVRegistration(true));
      dispatch(formActions.setUpdatedFormFields({ subscriberID: multiTvSubID }));
      navigate(ROUTE.WEB.MULTI_TV_REGISTRATION);
      return;
    }
    if (routeName === ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS) {
      dispatch(quoteActions.quotationEtskSetIsQuotationNavigate(true));
      navigate(ROUTE.WEB.SECONDARY_TSK_REGISTRATION);
      return;
    }
    if (routeName === ROUTE.WEB.QUOTATION_ETSK_SUCCESS) {
      dispatch(quoteActions.quotationEtskSetIsQuotationNavigate(true));
      navigate(ROUTE.WEB.ETSK_REGISTRATION);
      return;
    }
    dispatch(callAction({}, QUERY.ChangeBoxTypeQuotation));
  };

  const renderCard = (icon: string, text: string, route: string) => (
    <Pressable style={styles.cardStyle} onPress={() => moduleRouteHandler(route)}>
      <View style={styles.cardSubView}>
        <Image iconName={icon} height={Sizing.layout.x2} width={Sizing.layout.x2} />
        <Text style={styles.cardContentText}>{text}</Text>
      </View>
      <Image iconName={ICONS.PINK_CHEVRON_RIGHT} height={Sizing.layout.x2} width={Sizing.layout.x2} style={styles.primaryIconStyle} />
    </Pressable>
  );

  const successRoutes = [ROUTE.WEB.QUOTATION_ETSK_SUCCESS, ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS, ROUTE.WEB.QUOTATION_MULTITV_SUCCESS];

  const shouldShowField = !(successRoutes.includes(routeName) && (info?.roleId === PARTNER_ROLES.CSM || info?.roleId === PARTNER_ROLES.ASM || info?.roleId === PARTNER_ROLES.ASI));

  return (
    <SafeAreaView style={[styles.container]} testID="EtskRegistrationSuccess">
      <ScrollView style={styles.container} showsVerticalScrollIndicator>
        <View
          style={[
            styles.detailsCardContainer,
            styles[gcs('dynamicCardContainer50P', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
            styles[gcs('detailsCardContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])],
          ]}
        >
          {routeName !== ROUTE.WEB.QUOTATION_ETSK_SUCCESS && routeName !== ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS && <CustomerDetailsCard />}
          <View style={[styles.paddingContainer, styles[gcs('paddingContainer', inflection, true, ['sm', 'xs', 'md', 'lg', 'xl'])]]}>
            <View style={styles.successContainer}>
              <CommonSuccess
                iconName={iconName}
                primaryText={successData?.response?.message ?? successData?.result?.message}
                primaryStyles={styles.primarySuccessText}
                hasDefaultHeader
              />
            </View>
            {info?.hideAscWarranty !== STRINGS.HIDE &&
              showAscOptions &&
              routeName !== ROUTE.WEB.QUOTATION_ETSK_SUCCESS &&
              routeName !== ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS &&
              routeName !== ROUTE.WEB.QUOTATION_MULTITV_SUCCESS && (
                <View>
                  <View style={styles.ascContainer}>
                    <Text style={styles.primaryTextStyle} label={t(`strings.ASCWarrantyMessage`)} />
                  </View>
                  <View style={styles.ascButtonContainer}>
                    <Button
                      fontSize={Sizing.layout.x16}
                      label={t('strings.no')}
                      isDimension={false}
                      onPress={() => setShowAscOptions(false)}
                      type={STYLES.TYPE.SECONDARY}
                      outline
                      style={styles.buttonSec}
                    />
                    <Button
                      fontSize={Sizing.layout.x16}
                      label={t('strings.yes')}
                      isDimension={false}
                      onPress={() => {}}
                      type={STYLES.TYPE.SECONDARY}
                      outline
                      style={styles.buttonSec}
                    />
                  </View>
                </View>
              )}
            {routeName !== ROUTE.WEB.QUOTATION_ETSK_SUCCESS && routeName !== ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS && routeName !== ROUTE.WEB.QUOTATION_MULTITV_SUCCESS ? (
              <View style={styles.gapContainer}>
                <View style={styles.dealerContainer}>
                  <View style={styles.dealerSubContainer}>
                    <Text style={styles.primaryTextStyle} label={t(`strings.woNumber`)} />
                    <Text style={styles.secondaryTextStyle} label={successData?.response?.woNumber ?? successData?.woNumber ?? STRINGS.NA} />
                    <View style={styles.gap} />
                  </View>
                  <View style={styles.dealerSubContainer}>
                    <Text style={styles.primaryTextStyle} label={t(`strings.transactionId`)} />
                    <Text style={styles.secondaryTextStyle} label={successData?.response?.transId ?? successData?.result?.transId ?? STRINGS.NA} />
                    <View style={styles.gap} />
                  </View>
                  <View style={styles.dealerSubContainer}>
                    <Text style={styles.primaryTextStyle} label={t(`strings.rechargeAmount`)} />
                    <Text style={styles.secondaryTextStyle} label={successData?.response?.transId || successData?.result?.transId ? `₹${paidPrice}` : `₹0`} />
                    <View style={styles.gap} />
                  </View>
                  <View style={styles.dealerSubContainer}>
                    <Text style={styles.primaryTextStyle} label={t(`strings.addBoxPrice`)} />
                    <View style={styles.setTopBoxContainer}>
                      <Text style={[styles.secondaryTextStyle, validatePacksSuccessData?.noOfConnection > 1 && styles.divider]} label={boxTypeSelected} />
                      {renderBoxTypes(routeName, validatePacksSuccessData)}
                    </View>
                    <View style={styles.gap} />
                  </View>
                  {(successData?.response?.transId || successData?.result?.transId) && (
                    <View style={styles.dealerSubContainer}>
                      <Text style={styles.primaryTextStyle} label={t(`strings.invoice`)} />
                      <Pressable style={styles.downLoadInvoice} onPress={handleDownloadInvoice}>
                        <Text style={[styles.secondaryTextStyle, { color: Colors.appColors.pink }]} label={t(`strings.downloadInvoice`)} />
                        <Image iconName={ICONS.FILE_DOWNLOAD} height={Sizing.layout.x2} width={Sizing.layout.x2} style={styles.primaryIconStyle} />
                      </Pressable>
                      <View style={styles.gap} />
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.ascContainer}>
                <View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.customerInfoText}>{t('strings.mobileNo')}</Text>
                    <Text style={styles.customerInfoText}>{mobileNo}</Text>
                  </View>
                  {email?.trim() ? (
                    <View style={styles.infoContainer}>
                      <Text style={styles.customerInfoText}>{t('strings.emailId')}</Text>
                      <Text style={styles.customerInfoText}>{email}</Text>
                    </View>
                  ) : null}
                </View>
                {info?.roleId !== PARTNER_ROLES.CSM && info?.roleId !== PARTNER_ROLES.ASM && info?.roleId !== PARTNER_ROLES.ASI && (
                  <View>
                    <Button
                      fontSize={Sizing.layout.x16}
                      label={t('strings.continueToRegister')}
                      isDimension={false}
                      onPress={handleRegister}
                      type={STYLES.TYPE.SECONDARY}
                      outline
                      style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
                    />
                  </View>
                )}
              </View>
            )}
            {shouldShowField && (
              <View style={[styles.dealerContainerCard, styles[gcs('dealerContainerCard', inflection, true, ['md', 'lg', 'xl'])]]}>
                <Text style={styles.cardTitleText}>{t(`strings.moreActions`)}</Text>
                {routeName !== ROUTE.WEB.QUOTATION_ETSK_SUCCESS &&
                  routeName !== ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS &&
                  routeName !== ROUTE.WEB.QUOTATION_MULTITV_SUCCESS &&
                  (successData?.response?.transId || successData?.result?.transId) &&
                  renderCard(ICONS.RECHARGE_REVERSAL_PINK, t(`forms.rechargeReversal`), ROUTE.WEB.RECHARGE_REVERSAL)}
                {routeName !== ROUTE.WEB.QUOTATION_ETSK_SUCCESS &&
                  routeName !== ROUTE.WEB.QUOTATION_MULTITV_SUCCESS &&
                  routeName !== ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS &&
                  routeName !== ROUTE.WEB.ETSK_REG_SUCCESS &&
                  routeName !== ROUTE.WEB.ETSK_MULTI_TV_SUCCESS &&
                  routeName !== ROUTE.WEB.ETSK_MULTI_TV_REPUSH_SUCCESS &&
                  routeName !== ROUTE.WEB.ETSK_REPUSH_SUCCESS &&
                  renderCard(ICONS.BOX_TYPE_CHANGE_PINK, t(`strings.boxTypeChange`), ROUTE.WEB.BOX_TYPE_CHANGE)}
                {routeName !== ROUTE.WEB.ETSK_REG_SUCCESS &&
                  routeName !== ROUTE.WEB.ETSK_REPUSH_SUCCESS &&
                  routeName !== ROUTE.WEB.ETSK_MULTI_TV_SUCCESS &&
                  routeName !== ROUTE.WEB.ETSK_MULTI_TV_REPUSH_SUCCESS &&
                  routeName !== ROUTE.WEB.QUOTATION_ETSK_SUCCESS &&
                  routeName !== ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS &&
                  routeName !== ROUTE.WEB.QUOTATION_MULTITV_SUCCESS &&
                  routeName !== ROUTE.WEB.MULTI_TV_SUCCESS &&
                  renderCard(ICONS.WORK_ORDER, t(`strings.workOrderRecreation`), ROUTE.WEB.WORK_ORDER_RECREATION)}
                {routeName !== ROUTE.WEB.QUOTATION_ETSK_SUCCESS &&
                  routeName !== ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS &&
                  routeName !== ROUTE.WEB.QUOTATION_MULTITV_SUCCESS &&
                  renderCard(ICONS.ACTIVATION_STATUS_PINK, t(`strings.activationStatus`), ROUTE.WEB.ACTIVATION_STATUS)}
                {routeName === ROUTE.WEB.QUOTATION_PRIMARY_SUCCESS && (
                  <>
                    {renderCard(ICONS.OLD_QUOTATION, t(`strings.createAnotherQuote`), ROUTE.WEB.QUOTATION)}
                    {renderCard(ICONS.PRIMARY_TV_REGISTRATION, t(`strings.primaryTvRegistration`), ROUTE.WEB.PRIMARY_TV_REGISTRATION)}
                  </>
                )}
                {routeName === ROUTE.WEB.QUOTATION_MULTITV_SUCCESS && (
                  <>
                    {renderCard(ICONS.OLD_QUOTATION, t(`strings.createAnotherQuote`), ROUTE.WEB.QUOTATION)}
                    {renderCard(ICONS.MULTI_TV_ACCOUNT, t(`forms.multiTVRegistration`), ROUTE.WEB.MULTI_TV_REGISTRATION)}
                    {info?.roleId !== PARTNER_ROLES.fos && renderCard(ICONS.ETSK_MULTI_TV_PINK, t(`strings.etskMultiTv`), ROUTE.WEB.ETSK_MULTI_TV_REG)}
                  </>
                )}
                {routeName === ROUTE.WEB.QUOTATION_ETSK_SUCCESS && (
                  <>
                    {renderCard(ICONS.OLD_QUOTATION, t(`strings.createAnotherQuote`), ROUTE.WEB.QUOTATION)}
                    {info?.roleId !== PARTNER_ROLES.fos && renderCard(ICONS.ETSK_REGISTRATION, t(`forms.etskRegistration`), ROUTE.WEB.ETSK_REGISTRATION)}
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          iconName={ICONS.HOME}
          fontSize={Sizing.layout.x16}
          iconHeight={Sizing.layout.x15}
          iconWidth={Sizing.layout.x15}
          iconPosition={STYLES.POSITION.LEFT}
          label={t('strings.backToHome')}
          isDimension={false}
          onPress={() => goHome(isRedirection)}
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(ETskRegSuccess);
