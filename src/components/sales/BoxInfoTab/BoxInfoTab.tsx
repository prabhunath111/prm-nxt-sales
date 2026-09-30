/**
 * Tabs for displaying box and package information of the user.
 *
 * @module components/BoxInfoTab
 * @memberof CommonComponent
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import { ICONS, QUERY, ROUTE, STRINGS, STYLES, VALUE_TYPE } from 'const';
import { Colors, Sizing } from 'styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { callAction } from 'utils/formBuilderHelper';
import useNavigate from 'hooks/useNavigate';
import InformationText from 'components/sales/InformationText';
import Button from 'components/sales/Button';
import uiActions from 'store/sales/actions/ui';
import { ParentObject } from 'store/sales/types/common';
import { sliceActions } from 'store/sales/reducer/etskRegistration';
import { formatDurationForUI } from 'utils/responseHelper';
import i18next from 'i18next';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './BoxInfoTab.styles';

/**
 * Component props for BoxInfoTab
 *
 * @typedef {object} BoxInfoTabProps
 * @property {string} boxPrice - Price of the current box being displayed
 * @property {string} tsk - The TSK (Transaction Security Key or Identifier) associated with the box
 * @property {string} [ncf] - Optional NCF (Network Capacity Fee) associated with the box
 * @property {ParentObject[]} packs - Array of pack objects associated with the box
 * @property {boolean} isPrimary - Flag indicating whether this box is the primary box
 * @property {function} setIsPackChanged - Callback to update the state when pack selection changes
 */
export type BoxInfoTabProps = {
  boxPrice: ParentObject;
  tsk?: string;
  ncf?: string;
  ncfText?: string;
  packs: ParentObject[];
  isPrimary: boolean;
  setIsPackChanged: (val: boolean) => void;
  routeName?: string;
  totalPrice?: string;
  discountPrice?: string;
  dhamakaText?: string;
};

/**
 * Displays details of a set-top box including box fee, network capacity fee (NCF),
 * and the list of packs (offers) associated with it. Handles conditional rendering
 * and pack management based on whether the box is primary or secondary.
 *
 * @param {object} props - React properties passed from the parent component.
 * @param {string} props.boxPrice - Price of the current set-top box.
 * @param {string} props.tsk - TSK value, possibly used for transactional context.
 * @param {string} [props.ncf] - Optional Network Capacity Fee for the box.
 * @param {ParentObject[]} props.packs - Array of packs (offers) to be rendered for this box.
 * @param {boolean} props.isPrimary - Flag indicating whether this is the primary box.
 * @param {function} props.setIsPackChanged - Callback to indicate a pack has been added or removed.
 *
 * @returns {JSX.Element} Rendered component with box, fee, and pack list information.
 */

const BoxInfoTab = ({ boxPrice, tsk = '0', ncf = '0', ncfText = '', packs, isPrimary, setIsPackChanged, routeName, totalPrice, discountPrice, dhamakaText }: BoxInfoTabProps) => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();

  const { selectedPacksToBuy, accountCreationSuccessData } = useSelector((state: RootState) => state.etskRegistration);
  const freePack = accountCreationSuccessData.packageName?.[0]?.PackageInfo?.filter((pack: ParentObject) => pack.uom === i18next.t('strings.MONTHLY'))?.[0]?.packName;
  const selectedPrimaryPacks = [{ siebelName: freePack }, ...selectedPacksToBuy];
  const dataToRender = isPrimary ? selectedPrimaryPacks : packs;
  const isQuotationSummary =
    routeName === ROUTE.WEB.QUOTATION_ETSK_SUMMARY || routeName === ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY || routeName === ROUTE.WEB.QUOTATION_MULTITV_SUMMARY;

  const primaryText = isQuotationSummary ? 'customerQuotationAmount' : 'total';

  const secondaryText = `₹${totalPrice}${dhamakaText}`;

  const handleViewDetails = (item: ParentObject) => {
    dispatch(callAction({ offerName: item.siebelNameNT, packPrice: String(item.price) }, QUERY.GetOfferPackDetails))
      ?.then(async (response: ParentObject) => {
        if (response?.status) {
          await dispatch(uiActions.clearLoader());
          switch (routeName) {
            case ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY:
              navigate(ROUTE.WEB.PRIMARY_REG_OFFERS_DETAILS);
              break;
            case ROUTE.WEB.RE_PUSH_ORDER_SUMMARY:
              navigate(ROUTE.WEB.RE_PUSH_ORDER_OFFERS_DETAILS);
              break;
            case ROUTE.WEB.WO_RECREATION_SUMMARY:
              navigate(ROUTE.WEB.WO_OFFER_VIEW_DETAILS);
              break;
            case ROUTE.WEB.ETSK_REPUSH_SUMMARY:
              navigate(ROUTE.WEB.ETSK_REPUSH_OFFERS_VIEW_DETAILS);
              break;
            case ROUTE.WEB.QUOTATION_ETSK_SUMMARY:
              navigate(ROUTE.WEB.QUOTATION_ETSK_PACK_DETAILS);
              break;
            case ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY:
              navigate(ROUTE.WEB.QUOTATION_ETSK_PACK_DETAILS);
              break;
            case ROUTE.WEB.QUOTATION_MULTITV_SUMMARY:
              navigate(ROUTE.WEB.QUOTATION_ETSK_PACK_DETAILS);
              break;
            case ROUTE.WEB.BOX_TYPE_SUMMARY:
              MoengageMixpanel.trackEvent(MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ViewDetails.moduleName, {
                [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_PickPackProceed.attributes.Status]: true,
                [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ViewDetails.attributes.offerName]: item?.siebelNameNT,
                [MoengageMixpanelModules.BoxTypeChange.BoxTypeChange_ViewDetails.attributes.packPrice]: String(item.price),
              });
              navigate(ROUTE.WEB.BOX_TYPE_CHANGE_DETAILS);
              break;
            default:
              navigate(ROUTE.WEB.ETSK_OFFERS_VIEW_DETAILS);
              break;
          }
        }
      })
      .catch(() => {
        dispatch(uiActions.clearLoader());
      });
  };
  const onRemoveOffer = (value: ParentObject) => {
    setIsPackChanged(true);
    dispatch(sliceActions.etskRemoveSelectedPacksToBuyData(value));
    switch (routeName) {
      case ROUTE.WEB.PRIMARY_REGISTRATION_SUMMARY:
      case ROUTE.WEB.RE_PUSH_ORDER_SUMMARY:
        dispatch(callAction({}, QUERY.GetRentalPackNew));
        break;
      case ROUTE.WEB.WO_RECREATION_SUMMARY:
        dispatch(callAction({}, QUERY.GetWoRentalPack));
        break;
      case ROUTE.WEB.QUOTATION_PRIMARY_SUMMARY:
        dispatch(callAction({}, QUERY.DoGetRentalPackNewPartnerQuote));
        break;
      case ROUTE.WEB.QUOTATION_ETSK_SUMMARY:
        dispatch(callAction({}, QUERY.DoGetRentalPackNewPartnerQuoteEtsk));
        break;
      default:
        break;
    }
  };

  const packPrice = Math.ceil(
    dataToRender.reduce((total: number, pack: ParentObject) => {
      const price = parseFloat(pack?.packPrice ?? pack.price) || 0;
      return total + price;
    }, 0),
  );

  return (
    <View style={styles.container} testID="BoxInfoTab">
      <Text style={styles.cardStyle}>{t('strings.setTopBox')}</Text>
      <View style={styles.cardContainer}>
        <View style={[styles.textWrapperETSK, styles.topSpace]}>
          <Text style={[styles.primaryTextETSK, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}>{t('strings.addBoxPrice')}</Text>
          <View style={styles.rowStyle}>
            {boxPrice.old !== null && <Text style={[styles.secondaryTextPrice, styles.lineThrough]}>{`₹${boxPrice.old}`}</Text>}
            <Text style={styles.secondaryTextPrice}>{`₹${boxPrice.new}`}</Text>
          </View>
        </View>
        <View style={styles.bottomSeprator} />
        <InformationText
          containerStyle={styles.textWrapperETSK}
          primaryStyle={[styles.primaryTextETSK, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
          secondaryStyle={styles.secondaryTextETSK}
          primaryText={STRINGS.tskValue}
          secondaryText={tsk}
          type={VALUE_TYPE.AMOUNT}
        />
      </View>

      <View style={styles.rowStyle}>
        <Text style={styles.cardStyle}>{t('strings.networkCapicity')}</Text>
      </View>
      <View style={styles.cardContainer}>
        <InformationText
          containerStyle={styles.textWrapperETSK}
          primaryStyle={[styles.primaryTextETSK, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
          secondaryStyle={styles.secondaryTextETSK}
          primaryText={ncfText}
          secondaryText={ncf === '0' ? `₹${ncf}` : `₹${ncf}/${t('strings.month')}`}
        />
      </View>

      <View style={styles.cardStyle}>
        <InformationText
          containerStyle={styles.textWrapperETSK}
          primaryStyle={[styles.primaryTextYourPack, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
          secondaryStyle={styles.secondaryTextYourPack}
          primaryText="yourPacks"
          secondaryText={`${t('strings.total')} ₹${packPrice}`}
        />
      </View>

      <View style={styles.cardContainer}>
        {dataToRender.map((item: ParentObject, index: number) => {
          const isFreePack = index === 0;
          const labelPrice = item.packPrice ?? item.price;
          const durationKey = formatDurationForUI(item?.durationNT || STRINGS.MONTHLY);
          const translatedDuration = t(`strings.${durationKey}`);
          const labelPerDuration = durationKey ? `₹${labelPrice}/${translatedDuration}` : `₹${labelPrice}`;
          const secondaryText = isFreePack && isPrimary ? t('strings.free') : labelPerDuration;
          return (
            <View key={`${item.packName ?? item.friendlyName}-${item.packPrice ?? item.price}`} style={styles.tabOuterContainer}>
              <InformationText
                containerStyle={styles.textWrapperETSK}
                primaryStyle={[styles.primaryTextETSKPacks, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
                secondaryStyle={[styles.secondaryTextETSK, isFreePack && isPrimary && { color: Colors.appColors.midGreen }]}
                primaryText={item.packName ?? item.siebelName}
                secondaryText={secondaryText}
              />
              {!isFreePack && isPrimary && (
                <View style={styles.buttonContainerSmall}>
                  <Pressable onPress={() => handleViewDetails(item)}>
                    <Text style={styles.viewDetails}>{t('strings.viewDetails')}</Text>
                  </Pressable>

                  <Button
                    onPress={() => onRemoveOffer(item)}
                    iconPosition={STYLES.POSITION.LEFT}
                    style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
                    iconName={ICONS.DUSTBIN}
                    iconHeight={Sizing.layout.x2}
                    iconWidth={Sizing.layout.x1}
                    isDimension={false}
                    label={t('strings.drop')}
                    outline
                    fontColor={Colors.primary.brand}
                    labelStyle={styles.buttonLabelStyle}
                    fontSize={Sizing.layout.x16}
                  />
                </View>
              )}

              {index < dataToRender.length - 1 && <View style={styles.bottomSeprator} />}
            </View>
          );
        })}
      </View>
      {isQuotationSummary && (
        <InformationText
          containerStyle={styles.textWrapperETSK}
          primaryStyle={[styles.primaryTextETSKPacks, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])]]}
          secondaryStyle={styles.secondaryTextETSK}
          primaryText="estimatedRechargeAmount"
          secondaryText={`₹${discountPrice}`}
        />
      )}
      <InformationText
        containerStyle={styles.textWrapperETSK}
        primaryStyle={[styles.primaryTextETSKPacks, styles[gcs('primaryText', inflection, true, ['md', 'lg', 'xl'])], !isQuotationSummary && styles.flexOne]}
        secondaryStyle={[styles.secondaryTextETSK, !isQuotationSummary && styles.flexTwo]}
        primaryText={primaryText}
        secondaryText={secondaryText}
      />
    </View>
  );
};

export default BoxInfoTab;
