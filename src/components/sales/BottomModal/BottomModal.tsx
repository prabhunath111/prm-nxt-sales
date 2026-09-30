/**
 * Bottom custom modal for all screens
 *
 * @module components/BottomModal
 * @memberof CommonComponent
 */

import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gcs } from 'styles/webBreakpoints';
import { BreakPoints, useInflection } from 'wrappers/inflection/InflectionProvider';
import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import { CHILD_TYPE, ICONS, OFFER_TYPE, PROPERTIES, QUERY, ROUTE, STATE_KEY, STRINGS, STYLES } from 'const';
import { Colors, Sizing } from 'styles';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import uiActions from 'store/sales/actions/ui';
import commonActions from 'store/sales/actions/common';
import SalesNext from 'screens/sales/SalesNext';
import { ParentObject } from 'store/sales/types/common';
import OtpVerification from 'components/sales/OtpVerification';
import DealerDetailsCard from 'components/sales/DealerDetailsCard';
import Button from 'components/sales/Button';
import { callAction } from 'utils/formBuilderHelper';
import AddPackageOffer from 'components/sales/AddPackageOffer';
import { isAndroid, isWeb } from 'utils/platformHelper';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import DateRangePicker from 'components/sales/DateRangePicker';
import { closeWebView } from 'utils/navigationHelper';
import { handleRemoveOffer } from 'store/sales/actions/customerOffers/customerOffers.action';
import DynamicSalesNext from 'screens/sales/DynamicSalesNext';
import TextContainer from 'components/sales/TextContainer';
import DatePickerNew from 'components/sales/DatePickerNew';
import TimeSlotsContainer from 'components/sales/TimeSlotsContainer';
import RegistrationSalesNext from 'screens/sales/RegistrationSalesNext';
import SimpleDatePicker from 'components/sales/SimpleDatePicker';
import useCurrentRoute from 'hooks/useCurrentRoute';
import styles from './BottomModal.styles';

interface BottomModalProps {
  children?: React.ReactElement;
  modalProps?: ParentObject;
}

/**
 * Represents a BottomModal component
 *
 * @param {BottomModalProps} props - React properties passed from composition
 * @returns {JSX.Element} The rendered BottomModal component
 *
 * @example
 * <BottomModal isModalVisible={true}>
 *   <View>Modal content here </View>
 * </BottomModal>
 */

const BottomModal = ({ modalProps, children }: BottomModalProps) => {
  const { bottomModal: modalData, isModalLoading } = useSelector((state: RootState) => state.ui);
  const { navigate, goHome } = useNavigate();
  const { selectedOfferData } = useSelector((state: RootState) => state.customerOffers);
  const { dataPacks } = useSelector((state: RootState) => state.customerRecharge);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { isModalVisible, type, formName, headerTitle, headerIcon, showCloseIcon, showHeader, data, buttonInfo, isCenterModal, onClose, buttonInlineStyle } =
    modalProps ?? modalData;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { inflection } = useInflection();
  const { t, i18n } = useTranslation();
  const { routeName } = useCurrentRoute();

  const isInlineButtons = inflection === BreakPoints.MD || inflection === BreakPoints.MD_L || inflection === BreakPoints.LG || inflection === BreakPoints.XL;

  const closeModal = () => {
    if (routeName === ROUTE.WEB.INVOICE_TRANSACTION) {
      dispatch(uiActions.hideBottomModal());
      return;
    }
    dispatch(
      commonActions.setCustomFormData({
        evdMdnChangeFilter: {
          customDateRange: '',
          type: PROPERTIES.EVD_MDN_CHANGE_DETAILS.clear,
        },
      }),
    );

    dispatch(uiActions.hideBottomModal());
    onClose?.();
    if (buttonInfo?.goToHome) {
      if (isRedirection) {
        closeWebView();
      } else {
        goHome();
      }
    }
  };

  const removeOffer = () => {
    dispatch(uiActions.hideBottomModal());
    dispatch(handleRemoveOffer(true));
  };

  const handleViewDetails = (item: ParentObject) => {
    dispatch(
      callAction(
        { offerName: item.nameNT || item.packNameNT, packPrice: item.stdPriUnit ? String(item.stdPriUnit) : String(item.packPrice), isModal: true },
        QUERY.GetOfferPackDetails,
      ),
    )?.then((response: ParentObject) => {
      if (response?.status) {
        closeModal();
        navigate(ROUTE.WEB.MY_OFFERS_VIEW_DETAILS);
      }
    });
  };

  const getChildren = () => {
    switch (type) {
      case CHILD_TYPE.DYNAMIC_FORM:
        return <SalesNext customFormName={formName} stateKey={STATE_KEY.MODAL_STATE} containerStyle={styles.salesContainer} formContainerStyle={styles.formContainer} />;

      case CHILD_TYPE.DYNAMIC_SALES_NEXT_FORM:
        return <DynamicSalesNext customFormName={formName} stateKey={STATE_KEY.MODAL_STATE} containerStyle={styles.salesContainer} formContainerStyle={styles.formContainer} />;

      case CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM:
        return (
          <RegistrationSalesNext customFormName={formName} stateKey={STATE_KEY.MODAL_STATE} containerStyle={styles.salesContainer} formContainerStyle={styles.formContainer} />
        );

      case CHILD_TYPE.LABEl:
        return (
          <>
            {buttonInfo?.showCenteredHeaderIcon && (
              <Image iconName={headerIcon} height={Sizing.layout.x48} width={Sizing.layout.x48} isDimension={false} style={styles.headerIconStyle} />
            )}
            <Text
              label={t(`strings.${buttonInfo?.childData}`, { defaultValue: buttonInfo?.childData })}
              style={[styles.labelTextStyle, buttonInfo?.centerLabel && styles.centerTextStyle, styles[gcs('labelTextStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            />
            {buttonInfo?.subLabel && (
              <Text
                label={t(`strings.${buttonInfo?.subLabel}`)}
                style={[styles.labelTextStyle, buttonInfo?.centerLabel && styles.centerSubLabelTextStyle, styles[gcs('labelTextStyle', inflection, true, ['md', 'lg', 'xl'])]]}
              />
            )}
          </>
        );

      case CHILD_TYPE.PACK_CARD:
        return (
          <AddPackageOffer
            data={buttonInfo?.childData}
            openInModal
            isOfferAdded
            onRemoveOffer={removeOffer}
            onViewDetails={() => handleViewDetails(buttonInfo?.childData)}
            offerType={OFFER_TYPE[selectedOfferData?.offerType as keyof typeof OFFER_TYPE]}
            offerInModal
          />
        );

      case CHILD_TYPE.OTP_MODAL:
        return <OtpVerification mobile={data.mdn} queryName={buttonInfo?.queryName} params={data} buttonInfo={buttonInfo} />;

      case CHILD_TYPE.PARTNER_DETAILS:
        return (
          <View>
            <DealerDetailsCard name={data.name} evdCode={data.evdCode} mdn={data.mdn} title={data.title} link={false} />
            <Text style={styles.textMessage} label={data.textMessage} />
          </View>
        );

      case CHILD_TYPE.CUSTOM_DATE_PICKER:
        return <DateRangePicker isMultiDates={buttonInfo?.isMultiDates} defaultDateSelection={buttonInfo?.defaultDateSelection} maxDateCount={buttonInfo?.maxDateCount} />;

      case CHILD_TYPE.CALENDAR:
        return <DatePickerNew isMultiDates={buttonInfo?.isMultiDates} defaultDateSelection={buttonInfo?.defaultDateSelection} />;

      case CHILD_TYPE.DATE_TIME:
        return <TimeSlotsContainer />;

      case CHILD_TYPE.SIMPLE_CALENDER:
        return <SimpleDatePicker />;

      case CHILD_TYPE.INFO_TEXT:
        return (
          <View>
            <TextContainer
              maxFontSize={Sizing.layout.x18}
              data={buttonInfo?.childData}
              dataArray={buttonInfo?.childKey}
              primaryStyle={[styles.primaryText, PROPERTIES.LANG_LIST_SOUTH.includes(i18n.language) && { whiteSpace: 'wrap' }]}
              secondaryStyle={styles.secondaryText}
              separator=" : "
              itemContainerStyle={styles.textWrapper}
            />
          </View>
        );
      case CHILD_TYPE.PARTNER_MARGIN:
        return (
          <View>
            <View style={styles.textWrapper}>
              <Text maxFontSize={Sizing.layout.x18} style={[styles.primaryText, PROPERTIES.LANG_LIST_SOUTH.includes(i18n.language) && { whiteSpace: 'wrap' }]}>
                {`${t(`strings.partnerMargin`)} : `}
              </Text>
              {dataPacks?.accountInfo?.accountType === STRINGS.RESIDENTIAL ? (
                <View style={styles.gridContainer}>
                  {PROPERTIES.CUSTOMER_RECHARGE.TABLE_DATA.map((row: ParentObject, index: number) => (
                    <View key={row.range} style={styles.row}>
                      <View style={styles.cell}>
                        <Text style={[styles.gridText, index === 0 && styles.boldHeader]}>{index === 0 ? t(`strings.${row.range}`) : row.range}</Text>
                      </View>
                      <View style={styles.cell}>
                        <Text style={[styles.gridText, index === 0 && styles.boldHeader]}>{index === 0 ? t(`strings.${row.value}`) : row.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text maxFontSize={Sizing.layout.x18} style={[styles.secondaryTextLabel, styles.secondaryText]}>
                  NA
                </Text>
              )}
            </View>
            <View style={[styles.textWrapper, styles.topSpace]}>
              <Text maxFontSize={Sizing.layout.x18} style={styles.primaryText}>
                {`${t(`strings.subscriberOffer`)} : `}
              </Text>
              <Text maxFontSize={Sizing.layout.x18} style={[styles.secondaryTextLabel, styles.secondaryText]}>
                {buttonInfo?.childData?.subscriberOffer}
              </Text>
            </View>
          </View>
        );

      case CHILD_TYPE.WINBACK_FLEXI_MARGIN: {
        const hasDealerMargin = buttonInfo?.childData?.[0]?.dealerMargin > 0;

        const combinedDisclaimer = buttonInfo?.childData
          ?.map((offer: any) => offer?.winbackOfferDisclaimer ?? offer?.segmentedOfferDisclaimer)
          .filter(Boolean)
          .join('\n\nOR\n\n');
        return (
          <View>
            {/* Partner Margin */}
            {hasDealerMargin && (
              <View style={styles.textWrapper}>
                <Text maxFontSize={Sizing.layout.x18} style={[styles.primaryText, PROPERTIES.LANG_LIST_SOUTH.includes(i18n.language) && { whiteSpace: 'wrap' }]}>
                  {`${t('strings.partnerMargin')} : `}
                </Text>

                <Text maxFontSize={Sizing.layout.x18} style={[styles.secondaryTextLabel, styles.secondaryText]}>
                  {buttonInfo?.childData?.[0]?.dealerMargin}
                </Text>
              </View>
            )}

            {/* Subscriber Offer */}
            <View style={[styles.textWrapper, styles.topSpace]}>
              <Text maxFontSize={Sizing.layout.x18} style={styles.primaryText}>
                {`${t('strings.subscriberOffer')} : `}
              </Text>

              <Text maxFontSize={Sizing.layout.x18} style={[styles.secondaryTextLabel, styles.secondaryText]}>
                {combinedDisclaimer}
              </Text>
            </View>
          </View>
        );
      }

      default:
        return <View />;
    }
  };

  const handleSubmit = () => {
    if (buttonInfo?.queryName) {
      dispatch(callAction(buttonInfo?.queryParams ? buttonInfo?.queryParams : {}, buttonInfo?.queryName, '', navigate))?.then((res: ParentObject) => {
        if (res?.routeName) {
          dispatch(uiActions.hideBottomModal());
          navigate(res?.routeName);
        } else if (buttonInfo?.queryParams?.actionType === STRINGS.MDN_CHNAGE_REJECT) {
          dispatch(uiActions.clearLoader());
        }
      });
      modalProps?.onClose(false);
      if (buttonInfo?.routeName === ROUTE.WEB.TSK_CANCELLATION) {
        dispatch(uiActions.hideBottomModal());
        navigate(buttonInfo.routeName);
      }
    } else if (buttonInfo?.isRedirection) {
      closeModal();
      closeWebView();
    } else {
      closeModal();
    }
  };

  // added this method because we want to call an action on secondary button(MODIFY) as well
  const handleSecondarySubmit = () => {
    if (buttonInfo?.secondaryQueryName) {
      dispatch(callAction(buttonInfo?.secondaryQueryParams ? buttonInfo?.secondaryQueryParams : null, buttonInfo?.secondaryQueryName, '', navigate))?.then((res: ParentObject) => {
        if (res?.routeName) {
          dispatch(uiActions.hideBottomModal());
          navigate(res?.routeName);
        }
      });
      modalProps?.onClose(false);
    } else if (buttonInfo?.isRedirection) {
      closeModal();
      closeWebView();
    } else {
      closeModal();
    }
  };

  const handleButtonPress = () => {
    handleSubmit();
  };

  const showModal = (
    <Modal statusBarTranslucent visible={isModalVisible} animationType="none" onRequestClose={closeModal} transparent>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={isAndroid() ? Sizing.layout.x60 : Sizing.layout.x0} style={styles.keyboardContainer}>
        <View
          style={[
            styles.modalContainer,
            styles[gcs('modalContainer', inflection, true, ['md', 'lg', 'xl'])],
            isCenterModal && styles.centerContent,
            window.webkit?.messageHandlers?.cordova_iab && styles.centerContent,
            { paddingBottom: insets.bottom },
          ]}
        >
          <View
            id="toast_modal"
            style={[
              styles.modalViewStyle,
              styles[gcs('modalViewStyle', inflection, true, ['md', 'lg', 'xl'])],
              isCenterModal && styles.modalWidthStyle,
              isInlineButtons && buttonInlineStyle && styles.inlineButton,
              styles[gcs('inlineButton', inflection, true, ['md', 'lg', 'xl'])],
              buttonInfo?.isDateRangePicker ? styles.dateRangePickerContainer : {},
              buttonInfo?.isDateRangePicker ? styles[gcs('dateRangePickerContainer', inflection, true, ['md', 'lg', 'xl'])] : {},
            ]}
            testID="bottomModalTest"
          >
            <View style={[styles.topContainer, buttonInfo?.isDateRangePicker ? styles.dateRangePicker : {}, styles[gcs('dateRangePicker', inflection, true, ['md', 'lg', 'xl'])]]}>
              {showHeader && (
                <View style={styles.headerContainer}>
                  <View style={styles.rowContainer}>
                    {!buttonInfo?.showCenteredHeaderIcon && headerIcon && (
                      <Image
                        iconName={headerIcon}
                        height={PROPERTIES.LARGE_ICON.includes(headerIcon) ? Sizing.layout.x32 : Sizing.layout.x24}
                        width={PROPERTIES.LARGE_ICON.includes(headerIcon) ? Sizing.layout.x32 : Sizing.layout.x24}
                        isDimension={false}
                      />
                    )}
                    {headerTitle ? <Text style={styles.headerText}>{t(`strings.${headerTitle}`, { defaultValue: headerTitle })}</Text> : null}
                  </View>
                  {showCloseIcon && (
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                      <Image iconName={ICONS.CLOSE} height={Sizing.layout.x16} width={Sizing.layout.x16} isDimension={false} />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <ScrollView showsVerticalScrollIndicator bounces={false}>
                {children || getChildren()}
              </ScrollView>
            </View>
            {buttonInfo?.primaryButtonLabel || buttonInfo?.secondaryButtonLabel ? (
              <View
                style={[
                  styles.buttonContainer,
                  isInlineButtons && buttonInlineStyle && styles.buttonInlineContainer,
                  styles[gcs('buttonInlineContainer', inflection, true, ['md', 'lg', 'xl'])],
                ]}
              >
                {buttonInfo.primaryButtonLabel && (
                  <View style={[isInlineButtons && buttonInlineStyle && styles.buttonWidth, styles[gcs('buttonWidth', inflection, true, ['md', 'lg', 'xl'])]]}>
                    <Button
                      label={isModalLoading ? <ActivityIndicator color={Colors.neutral.white} /> : t(`modal.${buttonInfo.primaryButtonLabel}`)}
                      onPress={handleButtonPress}
                      disabled={isModalLoading}
                    />
                  </View>
                )}

                {buttonInfo.secondaryButtonLabel && (
                  <View style={[isInlineButtons && buttonInlineStyle && styles.buttonWidth, styles[gcs('buttonWidth', inflection, true, ['md', 'lg', 'xl'])]]}>
                    <Button
                      label={t(`modal.${buttonInfo.secondaryButtonLabel}`)}
                      type={STYLES.TYPE.SECONDARY}
                      onPress={handleSecondarySubmit}
                      outline={buttonInfo?.hasOutline || false}
                      disabled={isModalLoading}
                      labelStyle={buttonInlineStyle && styles.buttonSeconadryText}
                    />
                  </View>
                )}
              </View>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return isWeb ? isModalVisible && showModal : showModal;
};

export default BottomModal;
