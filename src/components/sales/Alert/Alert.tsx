/**
 * Component responsible for handling the Alerts
 *
 * @module components/Alert
 * @memberof - Common Component
 */
import React, { useState, useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import uiActions from 'store/sales/actions/ui';
import actions from 'store/sales/actions/form';
import { ALERT, ICONS, STYLES, CHILD_TYPE, VALUE_TYPE, PROPERTIES, ROUTE, STRINGS, QUERY } from 'const';
import { AppDispatch, RootState } from 'store';
import { Sizing } from 'styles';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import useCurrentRoute from 'hooks/useCurrentRoute';
import Button from 'components/sales/Button';
import InformationText from 'components/sales/InformationText';
import TextContainer from 'components/sales/TextContainer';
import { closeWebView, handleWebViewUrl } from 'utils/navigationHelper';
import { callAction } from 'utils/formBuilderHelper';
import RadioContainer from 'components/sales/RadioContainer';
import Link from 'components/sales/Link';
import { ParentObject } from 'store/sales/types/common';
import { LOG } from 'config/logger';
import styles from './Alert.styles';

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type AlertProps = {
  /** containerStyles prop is used as a style for Animated.View container */
  containerStyles?: object;
  /** Styles for the text shown in the Alert */
  textStyles?: object;
  /** Styles for the icon shown in the Alert */
  /** iconStyles?: object; */
  /** Specifies if useNativeDriver should be used for animations of Alert, default: `true` */
  useNativeDriver?: boolean;
  /** Specifies if useNativeDriver should be used for animations of Alert, default: `false` */
  /** showIcon?: boolean; */
  /** The transition animation. Currently 'fade' is the only one supported. */
  /** transition?: string; */
  /** Enable animations, default: `true` */
  animated?: boolean;
};

interface HandleConfirmParams {
  routeName?: string;
  clearForm?: boolean;
  closeView?: boolean;
}

/**
 * Represents a Alert component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Alert
 */
const Alert = ({ containerStyles, textStyles, useNativeDriver = true, animated = true }: AlertProps) => {
  const { inflection } = useInflection();
  const opacity = useRef(new Animated.Value(0)).current;
  const [alertTimeout, setAlertTimeout]: any = useState();
  const [typeStyles, setTypeStyles] = useState({});
  const [typeTextStyles, setTypeTextStyles] = useState({});
  const { routeName } = useCurrentRoute();
  const {
    hasAlert,
    isToast,
    hasError,
    alert: { message, duration, type, buttonInfo, childInfo },
    error,
  } = useSelector((state: RootState) => state.ui);
  const { isRedirection } = useSelector((state: RootState) => state.user);
  const { winBackSuccessData } = useSelector((state: RootState) => state.rechargeWinback);
  const [radioValue, setRadioValue] = useState<string | null>();

  const dispatch = useDispatch<AppDispatch>();
  const { navigate, goHome } = useNavigate();
  const { t } = useTranslation();

  const show = () => {
    if (animated) {
      Animated.timing(opacity, {
        toValue: 1,
        useNativeDriver,
      }).start();
    }
  };

  const hideAlert = () => {
    dispatch(uiActions.clearAlert());
    dispatch(uiActions.exitErrorPage());
    dispatch(actions.setSubIdList([]));
  };
  const handleCancel = () => {
    dispatch(uiActions.clearAlert());
    dispatch(uiActions.exitErrorPage());
    dispatch(actions.setSubIdList([]));
    if (buttonInfo?.secondaryQueryName) {
      dispatch(callAction(buttonInfo?.secondaryQueryParams ? buttonInfo?.secondaryQueryParams : null, buttonInfo?.secondaryQueryName, '', navigate));
    }
  };

  const hide = () => {
    setAlertTimeout(0);
    if (animated) {
      Animated.timing(opacity, {
        toValue: 0,
        useNativeDriver,
      });
    } else {
      hideAlert();
    }
  };

  useEffect(() => {
    if (hasAlert || isToast) {
      clearTimeout(alertTimeout);
      if (type === ALERT.INFO) {
        setTypeStyles(styles.info);
        setTypeTextStyles(styles.infoText);
      } else if (type === ALERT.SUCCESS) {
        setTypeStyles(styles.success);
        setTypeTextStyles(styles.successText);
      } else if (type === ALERT.WARNING) {
        setTypeStyles(styles.warning);
        setTypeTextStyles(styles.warningText);
      } else if (type === ALERT.ERROR) {
        setTypeStyles(styles.error);
        setTypeTextStyles(styles.errorText);
      } else {
        setTypeStyles({});
        setTypeTextStyles({});
      }
      const timeout: any = setTimeout(hide, duration);
      setAlertTimeout(timeout);
      show();
    } else {
      hide();
    }
  }, [message, duration, type, hasAlert, isToast]);

  const renderChildElement = () => {
    const { data, listData }: any = childInfo;
    switch (childInfo?.type) {
      case CHILD_TYPE.LIST_DATA:
        return (
          <View style={styles.listContainer}>
            <View style={styles.messageContainer}>
              <Text maxFontSize={Sizing.layout.x18} style={styles.messageText}>
                {data.subMessage}
              </Text>
            </View>
            <TextContainer
              maxFontSize={Sizing.layout.x18}
              data={data}
              dataArray={listData}
              primaryStyle={styles.formKey}
              secondaryStyle={styles.formatValue}
              separator=":"
              itemContainerStyle={styles.formItem}
            />
          </View>
        );

      case CHILD_TYPE.TEXT:
        return (
          <Text maxFontSize={Sizing.layout.x18} style={styles.childTextStyle}>
            {data.text}
          </Text>
        );

      case CHILD_TYPE.INFO_TEXT:
        return (
          <View>
            <InformationText
              primaryText={PROPERTIES.CUSTOMER_RECHARGE.BALANCE}
              secondaryText={data.balance}
              primaryStyle={styles.primaryTextStyle}
              secondaryStyle={styles.secondaryTextStyle}
              containerStyle={styles.balanceContainerStyle}
              separator=":"
              type={VALUE_TYPE.AMOUNT}
            />
            <Text maxFontSize={Sizing.layout.x18} style={styles.subTextStyle}>
              {data.subMessage}
            </Text>
          </View>
        );

      case CHILD_TYPE.INFO_TEXT_WITH_DATA:
        return (
          <View>
            <TextContainer
              maxFontSize={Sizing.layout.x18}
              data={data}
              dataArray={listData}
              primaryStyle={styles.formKey}
              secondaryStyle={styles.formatValue}
              separator=" : "
              itemContainerStyle={styles.itemContainer}
            />
            <Text maxFontSize={Sizing.layout.x18} style={styles.subTextStyle}>
              {data.subMessage}
            </Text>
          </View>
        );

      case CHILD_TYPE.RADIO_CONTAINER:
        return <RadioContainer items={data} selectedValue={radioValue} onSelectionChange={(value: string) => setRadioValue(value)} />;

      default:
        return null;
    }
  };

  const handleConfirm = ({ closeView }: HandleConfirmParams): void => {
    hideAlert();
    if (routeName === ROUTE.WEB.CONFIRM_REVERSAL_INFO) {
      navigate(ROUTE.WEB.RECHARGE_TRANSACTION);
      return;
    }
    if (routeName === ROUTE.WEB.CONFIRM_REVERSAL_INFO_FOS) {
      navigate(ROUTE.WEB.RECHARGE_TRANSACTION_FOS);
      return;
    }

    if (buttonInfo?.redirectUser) {
      navigate(ROUTE.WEB.ERROR);
    }
    if (buttonInfo?.routeName) {
      navigate(buttonInfo.routeName, { ...buttonInfo?.params });
      dispatch(actions.resetNavigationData());
    }

    if (buttonInfo?.clearForm) {
      dispatch(actions.clearFormData(true));
    }

    if (closeView) {
      if (isRedirection) {
        closeWebView();
      } else {
        goHome();
      }
    }

    if (buttonInfo?.queryName) {
      dispatch(callAction({ ...buttonInfo.queryParams, radioValue }, buttonInfo.queryName, '', navigate));
    }
    if (buttonInfo?.onProceed) {
      buttonInfo?.onProceed?.();
    }
  };

  const handleDownloadInvoice = () => {
    LOG.info(`Customer recharge invoice transactionId : ${childInfo?.data}`);
    dispatch(callAction({ transactionId: childInfo?.data?.invoiceTransactionId ? childInfo?.data.invoiceTransactionId : childInfo?.data.transId }, QUERY.GetInvoiceURL))
      ?.then((response: ParentObject) => {
        dispatch(actions.clearFormData(true));
        if (response?.status) {
          hideAlert();
          LOG.info(`Customer recharge invoice url : ${response?.invoiceUrl}`);
          handleWebViewUrl(response?.invoiceUrl, true);
        }
      })
      .catch((res: any) => {
        LOG.info(`Customer recharge invoice error : ${res}`);
      });
  };

  const renderIcon = () => {
    switch (type) {
      case ALERT.INFO:
        return ICONS.ALERT_INFO;
      case ALERT.ERROR:
        return ICONS.ERROR;
      case ALERT.CONFIRM:
        return ICONS.ALERT_CONFIRM;
      case ALERT.WARNING:
        return ICONS.WARNING_EXCLAMATION;
      default:
        return ICONS.ALERT_SUCCESS;
    }
  };

  const renderErrorMsg = () => {
    switch (error?.message) {
      case hasError && STRINGS.INTERNAL_SERVER_ERROR:
        return t('errors.internalError');
      case hasError && STRINGS.REDIRECTION_ERROR:
        return t('errors.redirectionError');

      default: {
        let errorMessage = error?.message || message;

        if (errorMessage === PROPERTIES.DEALER_FEEDBACK.pleaseSelectMonth || errorMessage === PROPERTIES.DEALER_FEEDBACK.pleaseValidateSubscriberId) {
          errorMessage = t(`errors.${message}`);
        }

        return errorMessage;
      }
    }
  };

  const renderToastAlert = hasAlert ? (
    <Animated.View style={[styles.container, typeStyles, containerStyles, animated && { opacity }]} testID="alert">
      <Text style={[styles.text, typeTextStyles, textStyles]}>{message}</Text>
    </Animated.View>
  ) : (
    <View testID="alert" />
  );

  const renderToastModal = (
    <Animated.View
      style={[styles.toastAlertContainer, styles[gcs('toastAlertContainer', inflection, true, ['md', 'lg', 'xl'])], { transform: [{ translateY: opacity }] }]}
      testID="alert"
    >
      <View id="toast_modal" style={[styles.toastAlertViewStyle, styles[gcs('toastAlertViewStyle', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Image iconName={renderIcon()} height={Sizing.layout.x48} width={Sizing.layout.x48} isDimension={false} />
        <View style={styles.alertTitleContainer}>
          <Text
            style={[buttonInfo?.textLeft ? styles.textLeftStyle : styles.textCenterStyle, styles.toastAlertTitle, styles[gcs('toastAlertTitle', inflection, true, ['sm', 'xs'])]]}
          >
            {renderErrorMsg()}
          </Text>
          {buttonInfo?.showWinBackMessage && winBackSuccessData?.message && <Text style={[styles.textCenterStyle, styles.toastAlertTitleWin]}>{winBackSuccessData?.message}</Text>}
        </View>
        {renderChildElement()}
        <View style={[styles.toastAlertBtnContainer, styles[gcs('toastAlertBtnContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          {buttonInfo?.isSecondaryRequire ? (
            <Button label={t(`modal.${buttonInfo?.secondaryText}`)} onPress={handleCancel} style={styles.toastAlertCancelButton} type={STYLES.TYPE.SECONDARY} outline />
          ) : null}
          <Button
            label={t(`modal.${buttonInfo?.primaryText}`)}
            onPress={() => handleConfirm({ routeName: buttonInfo?.routeName, clearForm: buttonInfo?.clearForm, closeView: buttonInfo?.closeView })}
            style={[styles.toastAlertConfirmButton]}
          />
        </View>
        {buttonInfo?.showDownloadInvoice ? (
          <View style={styles.linkContainer}>
            <Image iconName={ICONS.DOWNLOAD} isDimension={false} height={Sizing.layout.x18} width={Sizing.layout.x18} />
            <Link label={t('strings.downloadInvoice')} onPress={handleDownloadInvoice} labelStyle={styles.linkTextStyle} />
          </View>
        ) : null}
      </View>
    </Animated.View>
  );

  return isToast ? renderToastModal : renderToastAlert;
};

export default Alert;
