import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput as RNTextInput, ActivityIndicator, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import TextInput from 'components/sales/TextInput';
import Text from 'components/sales/Text';
import uiActions from 'store/sales/actions/ui';
import commonAction from 'store/sales/actions/common';
import Button from 'components/sales/Button';
import { ALERT, MODAL, PROPERTIES, QUERY, ROUTE, STRINGS, STYLES } from 'const';
import { Colors, Sizing } from 'styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import Link from 'components/sales/Link';
import { ParentObject } from 'store/sales/types/common';
import { callAction } from 'utils/formBuilderHelper';
import useNavigate from 'hooks/useNavigate';
import styles from './OtpVerification.styles';

/**
 * Component type definitions
 *
 * @typedef {object} OtpVerificationProps
 * @property {string} [mobile] - The content for the component
 */

export type OtpVerificationProps = {
  mobile?: string;
  queryName?: string;
  params?: ParentObject;
  buttonInfo?: ParentObject;
  autoFocus?: boolean;
};

/**
 * Represents a OtpVerification component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.mobile] - The content for the component
 * @returns {JSX.Element} The rendered OtpVerification component
 *
 * @example
 * <OtpVerification mobile="1234567889" />
 */

const OtpVerification = ({ mobile, queryName = '', params, buttonInfo, autoFocus = true }: OtpVerificationProps) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(Array(Sizing.layout.x6).fill(''));
  const [seconds, setSeconds] = useState(PROPERTIES.RESET_EVD.otpTimer);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errorMessage } = useSelector((state: RootState) => state.common);
  const { navigate } = useNavigate();
  const inputsRef = useRef<(RNTextInput | null)[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  let interval: any = null;

  const startTimer = () => {
    setSeconds(PROPERTIES.RESET_EVD.otpTimer);
    setIsActive(true);
  };

  const resetTimer = () => {
    setSeconds(PROPERTIES.RESET_EVD.otpTimer);
    startTimer(); // Start the timer again after reset
  };

  useEffect(() => {
    startTimer(); // Start timer when component mounts

    return () => {
      if (interval) {
        clearInterval(interval); // Clear the interval on cleanup
      }
    };
  }, []);

  interval = useMemo(() => {
    if (isActive) {
      return setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(interval!);
            setIsActive(false); // Stop the timer when it reaches zero
            return 0; // Ensure seconds does not go below zero
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    return null;
  }, [isActive]); // Only creates interval when isActive changes

  useEffect(() => () => clearInterval(interval!), [interval]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === STRINGS.BACKSPACE && index > 0 && !otp[index]) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleCloseModal = () => {
    dispatch(uiActions.hideBottomModal());
  };
  const handleCancel = () => {
    dispatch(uiActions.hideBottomModal());
    if (buttonInfo?.secondaryQueryName) {
      dispatch(callAction(buttonInfo?.secondaryQueryParams ? buttonInfo?.secondaryQueryParams : null, buttonInfo?.secondaryQueryName, '', navigate));
    }
  };

  const handleOnChange = (value: string, index: number) => {
    handleOtpChange(value, index);
    if (errorMessage) {
      dispatch(commonAction.reSetErrorMessage());
    }
  };

  const handleSubmitOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      setLoading(true);
      dispatch(callAction({ otp: enteredOtp, type: STRINGS.SELF, ...params }, queryName, '', navigate))?.then((response: ParentObject) => {
        setLoading(false);
        if (response?.status) {
          handleCloseModal();
          if (response?.routeName) navigate(response?.routeName);
          if (queryName === QUERY.updateEvdMdn) {
            navigate(ROUTE.WEB.EVD_MDN_CHANGE_SUCCESS);
          } else if (buttonInfo?.routeName) {
            navigate(buttonInfo?.routeName);
          }
        } else {
          dispatch(commonAction.setErrorMessage(response?.message));
        }
      });
    } else {
      dispatch(commonAction.setErrorMessage(t('errors.otpError')));
    }
  };

  const approveViaDistHandler = () => {
    handleCloseModal();
    dispatch(
      uiActions.showAlert(
        t('strings.contactDistToChangeMdn'),
        ALERT.CONFIRM,
        {
          primaryText: MODAL.OK,
          secondaryText: MODAL.CANCEL,
          isSecondaryRequire: true,
          queryName: QUERY.updateEvdMdn,
          queryParams: { otp: '', type: STRINGS.DISTRIBUTOR, ...params },
          clearForm: true,
        },
        {},
      ),
    );
  };

  const resendOtp = () => {
    setOtp(Array(Sizing.layout.x6).fill(''));
    resetTimer(); // Reset the timer when OTP is resent
    if (buttonInfo?.resendOtpQuery) {
      dispatch(callAction(buttonInfo?.resendOtpQueryParams ?? {}, buttonInfo?.resendOtpQuery));
    } else {
      dispatch(callAction({}, QUERY.ResendOTPWithOutSubId));
    }
    if (errorMessage) {
      dispatch(commonAction.reSetErrorMessage());
    }
  };

  const maskMobileNumber = (number: string | undefined) => (number && number.length === 10 ? `${number.slice(0, 3)}XXXX${number.slice(7)}` : number);

  return (
    <View style={styles.otpContainer} testID="OTP-test-id">
      <Text style={styles.otpTextStyle}>{t('strings.oneTimePassword')}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.enterOtpText}>{t('strings.enterOtp')}</Text>
        <View style={styles.sentToTextContainer}>
          <Text style={styles.sentToText}>{t(`strings.${buttonInfo?.sentToTitle}`)}</Text>
          <Text style={styles.enterOtpText} label={maskMobileNumber(mobile)} />
        </View>
      </View>
      <View style={styles.otpInputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={`${index.toString()}`}
            ref={(ref: any) => {
              inputsRef.current[index] = ref;
            }}
            inputFieldStyle={styles.otpFieldStyle}
            style={styles.otpInput}
            value={digit}
            maxLength={Sizing.layout.x1}
            keyboardType="numeric"
            isNumericKeyboard
            isNumericValue
            onChangeText={(value) => handleOnChange(value, index)}
            onKeyPress={(e: any) => handleKeyPress(e, index)}
            autoFocus={autoFocus && index === 0}
          />
        ))}
      </View>

      {!errorMessage &&
        (seconds === 0 ? (
          <View style={styles.resentContainer}>
            <Link labelStyle={[styles.sentToText, styles.colorPink]} onPress={resendOtp} label={t('strings.resendOtp')} />
          </View>
        ) : (
          <Text style={styles.resendText}>
            {t('strings.resendOtpIn')} {seconds}s
          </Text>
        ))}
      {errorMessage && <Text id={STRINGS.OTP_ERROR} style={styles.errorText} label={errorMessage} color={Colors.error.primary} />}

      {buttonInfo?.hasEvdLink && (
        <View>
          <Text style={styles.orText}>{t('strings.or')}</Text>
          <Pressable style={styles.linkContainer} onPress={() => approveViaDistHandler()}>
            <Text style={styles.linkTextStyle}>{t('strings.clickHeretoApproveViaDist')}</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.width100P}>
        <Button
          label={loading ? <ActivityIndicator color={Colors.neutral.white} /> : t(`strings.${buttonInfo?.otpButtonLabel}`)}
          type={STYLES.TYPE.PRIMARY}
          onPress={handleSubmitOtp}
        />
        <Button
          label={t('strings.back')}
          type={STYLES.TYPE.SECONDARY}
          style={styles.backButton}
          onPress={() => {
            handleCancel();
          }}
          outline={buttonInfo?.hasOutline || false}
        />
      </View>
    </View>
  );
};

export default OtpVerification;
