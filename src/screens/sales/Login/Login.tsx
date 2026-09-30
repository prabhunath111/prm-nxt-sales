/**
 * Represents the props for the LoginPage component.
 *
 * @typedef {object} LoginPageProps
 */

/**
 * Login screen for the PRM sales application.
 *
 * @component components/LoginPage
 * @memberof - View Component
 * @returns {JSX.Element} The LoginPage component.
 */
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ActivityIndicator, Pressable, TextInput as RNTextInput, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { Text, Image, Button, Gradient, BottomModal, Link, TextInput } from 'components/sales';
import { ALERT, ICONS, MODAL, PROPERTIES, QUERY, STRINGS, STYLES } from 'const';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import actions from 'store/sales/actions';
import userActions from 'store/sales/actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'config/i18n';
import { getDeviceID, isWeb } from 'utils/platformHelper';
import uiActions from 'store/sales/actions/ui';
import { ParentObject } from 'store/sales/types/common';
import { getStoredItem, setToken } from 'utils/sessionHelper';

import commonAction from 'store/sales/actions/common';
import { checkBiometrySupport, handleLocalAuthenticate } from 'utils/localAuthHelper';
import { LOCAL_AUTH, ROUTE } from 'const/strings';
// import { MOBILE_REGEX } from 'const/regexes';
import useNavigate from 'hooks/useNavigate';
import { callAction } from 'utils/formBuilderHelper';

import storageService from 'services/storageService/localStorage';

import { LOG } from 'config/logger';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import { login as authLogin } from '../../../Auth';
import styles from './Login.styles';

export type OtpVerificationProps = {
  mobile?: string;
  queryName?: string;
  params?: ParentObject;
  buttonInfo?: ParentObject;
  autoFocus?: boolean;
  setIsOtp?: any;
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

const OtpVerification = ({ mobile, queryName = '', params, buttonInfo, autoFocus = true, setIsOtp }: OtpVerificationProps) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(Array(Sizing.layout.x6).fill(''));
  const [seconds, setSeconds] = useState(PROPERTIES.RESET_EVD.otpTimer);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const { errorMessage } = useSelector((state: RootState) => state.common);
  const { navigate } = useNavigate();
  const inputsRef = useRef<(RNTextInput | null)[]>([]);
  const [isLocalAuthorized, setIsLocalAuthorized] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>();
  const { inflection } = useInflection();
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

  useEffect(() => {
    let timeoutId: any;

    if (otp.every((d) => d === '')) {
      timeoutId = setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [otp]);

  useEffect(() => {
    if(seconds <= 0){
      setText(t('strings.resendOtp'));
    }
    else{
      setText(`${t('strings.resendOtpIn')} ${seconds}s`);
    }
    }, [seconds]);

  const getUserData = async (): Promise<ParentObject | null> => {
    const data = await getStoredItem(STRINGS.USER_DETAILS);
    return data ? JSON.parse(data) : null;
  };

  const fetchLocalAuthData = useCallback(async () => {
    const data: ParentObject | null = await getUserData();

    if (data?.isLocalAuthEnabled === STRINGS.TRUE) {
      setIsLocalAuthorized(true);
      const biometricData = await checkBiometrySupport();

      if (biometricData?.available) {
        setBiometricType(biometricData?.biometryType);
      }
    } else {
      setIsLocalAuthorized(false);
    }
  }, []);

  useEffect(() => {
    fetchLocalAuthData();
  }, []);

  const handleLocalAuthentication = async () => {
    const data: ParentObject | null = await getUserData();
    const deviceId = await getDeviceID();
    dispatch(actions.setUserDetails({ ...data, deviceId }));

    dispatch(actions.checkMultipleLogins())?.then(async (response: ParentObject) => {
      if (response?.status) {
        if (!response.data?.tranStatus) {
          uiActions.showError(response.data?.transMessage);
        } else {
          const biometricData = await checkBiometrySupport();
          if (!biometricData?.available) {
            dispatch(uiActions.showError(t('errors.localAuthentication')));
          } else {
            const authenticated: any = await handleLocalAuthenticate();
            if (authenticated?.success) {
              dispatch(actions.loginWithLocalAuth());
            }
          }
        }
      }
    });
  };

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

  const handleOnChange = (value: string, index: number) => {
    handleOtpChange(value, index);
    if (errorMessage) {
      dispatch(commonAction.reSetErrorMessage());
    }
  };

  const handleSubmitOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      dispatch(commonAction.reSetErrorMessage());
      setLoading(true);
      dispatch(callAction({ otp: enteredOtp, ...params }, queryName, '', navigate))
        ?.then((response: ParentObject) => {
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
            setOtp(Array(Sizing.layout.x6).fill(''));
          }
        })
        .catch((error: ParentObject) => {
          dispatch(commonAction.setErrorMessage(error?.message));
          setOtp(Array(Sizing.layout.x6).fill(''));
        });
    } else {
      dispatch(commonAction.setErrorMessage(t('errors.otpError')));
      setOtp(Array(Sizing.layout.x6).fill(''));
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
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.Login.LoginPage_ResendOtp.moduleName, {
      [MoengageMixpanelModules.Login.LoginPage_ResendOtp.attributes.Status]: true,
      [MoengageMixpanelModules.Login.LoginPage_ResendOtp.attributes.isPrmLogin]: params?.isPrmLogin || true,
      [MoengageMixpanelModules.Login.LoginPage_ResendOtp.attributes.mdn]: params?.mdn,
    });
    dispatch(callAction({ ...params }, buttonInfo?.resendOtpQuery || QUERY.ResendOTPWithOutSubId));
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
            <Link labelStyle={[styles.sentToText, styles.colorPink]} onPress={resendOtp} label={text} />
          </View>
        ) : (
          <Text style={styles.resendText}>
            {text}
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
        {!isWeb && isLocalAuthorized && biometricType ? (
          <>
            <Text label={t('strings.newOr')} color={Colors.violet.v300} style={[styles.orTextStyle]} />
            <Button
              onPress={handleLocalAuthentication}
              label={biometricType === LOCAL_AUTH.BIOMETRICS ? `${t('strings.use')} ${t('strings.fingerPrint')}` : `${t('strings.use')} ${biometricType}`}
              type={STYLES.TYPE.PRIMARY}
              fontSize={Sizing.layout.x16}
              style={[styles.loginButton, styles[gcs('loginButton', inflection, true, ['lg'])]]}
            />
          </>
        ) : null}
        <Button
          label={t('strings.back')}
          type={STYLES.TYPE.SECONDARY}
          style={styles.backButton}
          onPress={() => {
            setIsOtp(false);
          }}
          outline
        />
      </View>
    </View>
  );
};

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the screen
 */

interface User {
  mdn?: string;
  userName?: string;
  isPrmLogin: boolean;
}

interface InputChangeEvent {
  name: string;
  value: string;
}

/**
 * Represents a LoginPage component
 *
 * @param {object} props - React properties passed from composition
 * @returns LoginPage
 */
const Login = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const [user, setUser] = useState<User>({
    isPrmLogin: true,
  });
  const [error, setError] = useState('');
  const [isOtp, setIsOtp] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const isNumberStart = /^[0-9]/.test(inputValue);
  const maxLength = isNumberStart ? Sizing.layout.x10 : Sizing.layout.x50;
  useEffect(() => {
    // set default language to english
    changeLanguage(STRINGS.EN);
  }, []);

  /**
   * Handles the login button press event.
   */

  const validateUserInput = (text: string) => {
    const trimmedText = text.trim();

    if (/^[0-9]/.test(trimmedText)) {
      if (!/^\d*$/.test(trimmedText)) return t('errors.invalidMobileNumber');
      // if (!/^[6-9]/.test(trimmedText)) return t('errors.mobileShouldStartWith');
      if (trimmedText.length !== 10) return t('errors.mobileLength10');
    } else if (/^[A-Za-z]/.test(trimmedText)) {
      if (trimmedText.length < 5) return t('errors.usernameMin5');
      if (trimmedText.length > 50) return t('errors.usernameMax50');
    }

    return '';
  };

  const getUserData = async (): Promise<ParentObject | null> => {
    const data = await getStoredItem(STRINGS.USER_DETAILS);
    return data ? JSON.parse(data) : null;
  };

  const onPressLogin = async () => {
    const hasError = !user?.mdn && !user?.userName;

    if (hasError) {
      setError(t('errors.enterUserName'));
    }
    const deviceId = await getDeviceID();
    const data: ParentObject | null = await getUserData();
    const params = {
      ...user,
      deviceId,
      isLocalAuthenticated: data?.isLocalAuthEnabled === STRINGS.TRUE,
    };
    dispatch(actions.setUserDetails({ ...params }));
    const payload = {
      ...user,
    };
    if (!hasError && !error) {
      dispatch(actions.checkMultipleLogins())
        ?.then((response: ParentObject) => {
          dispatch(uiActions.clearLoader());
          setInputValue('');
          if (response?.status) {
            Keyboard.dismiss();
            if (!response.data?.tranStatus) {
              dispatch(uiActions.showError(response.data?.transMessage));
            } else {
              dispatch(userActions.loginWithOtp(payload)).then((response: any) => {
                MoengageMixpanel.trackEvent(MoengageMixpanelModules.Login.LoginPage_GetOTP.moduleName, {
                  [MoengageMixpanelModules.Login.LoginPage_GetOTP.attributes.Status]: true,
                  [MoengageMixpanelModules.Login.LoginPage_GetOTP.attributes.deviceId]: deviceId,
                  [MoengageMixpanelModules.Login.LoginPage_GetOTP.attributes.isPrmLogin]: params?.isPrmLogin || true,
                  [MoengageMixpanelModules.Login.LoginPage_GetOTP.attributes.mdn]: user?.mdn || user?.userName,
                });
                if (response.status || response.login?.status) {
                  const data = response?.login ? response.login : response;
                  if (data?.mdn) {
                    setUser((prev) => ({ ...prev, mdn: data.mdn }));
                  }
                  setIsOtp(true);
                }
              });
            }
          } else {
            dispatch(commonAction.setErrorMessage(response?.message));
          }
        })
        .catch((error: ParentObject) => {
          setInputValue('');
          dispatch(commonAction.setErrorMessage(error?.message));
        });
    }
  };

  const handleAdLogin = async () => {
    try {
      LOG.error('Starting Azure AD login flow...');
      const result: any = await authLogin();
      LOG.error('Azure AD login successful. Obtained token length:', result?.idToken?.length);

      await setToken({ accessToken: result.idToken });
      await storageService.setItem(STRINGS.IS_AD, STRINGS.TRUE);

      let mobileNumber = null;
      let shortUserName = null;

      try {
        if (result.accessToken) {
          const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${result.accessToken}` },
          });
          const profileData = await graphResponse.json();
          mobileNumber = profileData.mobilePhone || profileData.businessPhones?.[0];
          const fullEmail = profileData.userPrincipalName || profileData.mail;
          shortUserName = fullEmail?.includes('@') ? fullEmail.split('@')[0] : fullEmail;
          LOG.info('Successfully fetched MS Graph data from frontend.');
        }
      } catch (e) {
        LOG.error('Failed to fetch MS Graph data natively.', e);
      }

      // Safe robust fallback guaranteeing no suffix attached before passing to BFF
      let fallbackName = result.user?.preferred_username || result.user?.email || result.user?.name || '';
      fallbackName = fallbackName?.includes('@') ? fallbackName.split('@')[0] : fallbackName;

      const userName = shortUserName || fallbackName;
      
      const payload = {
        userName,
        mdn: mobileNumber,
        isPrmLogin: false,
        accessToken: result.idToken, // Passing ID token for backend validation
      };

      LOG.info('Verifying AD token with backend payload:', JSON.stringify(payload));

      const response: any = await dispatch(userActions.loginWithAd(payload));

      LOG.error('AD verification response from backend:', JSON.stringify(response));

      if (response?.status || response?.userId) {
        LOG.error('AD Verification successful. App should now navigate to dashboard.');
        console.warn('AAD Verification Success');
        navigate(ROUTE.WEB.DASHBOARD);
      } else {
        const errorMsg = response?.message || 'Backend verification failed';
        LOG.error('AD Login verification failed at backend:', errorMsg);
        // dispatch(uiActions.showError(errorMsg));
      }
    } catch (error: any) {
      LOG.error('Error during AD Login process:', error?.message || error);
      // dispatch(uiActions.showError(t('errors.loginFailed')));
    }
  };

  const handleInputChange = ({ name, value }: InputChangeEvent) => {
    setUser((prev) => {
      if (name === STRINGS.MDN) {
        return { isPrmLogin: prev.isPrmLogin, mdn: value };
      }
      return { isPrmLogin: prev.isPrmLogin, userName: value };
    });
  };
  useEffect(() => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.Login.Login_PageVisit.moduleName, {
      [MoengageMixpanelModules.Login.Login_PageVisit.attributes.Status]: true,
    });
  }, []);

  const renderLoginWithOtp = () => (
    <>
      <Text label={t(`strings.Login`)} style={styles.heading} />
      <View style={[styles.inputContainer, styles[gcs('inputContainer', inflection, true, ['lg'])]]}>
        <Text label={t('strings.registeredMobileNo')} fontSize={Sizing.layout.x14} style={styles.labelText} />
        <TextInput
          value={inputValue}
          onChangeText={(text: string) => {
            const filteredText = text.replace(/[^a-zA-Z0-9_]/g, '');
            setInputValue(filteredText);
            const regex = /^[0-9]/;
            // MOBILE_REGEX;
            setError(validateUserInput(text));
            handleInputChange({
              name: regex.test(text) ? STRINGS.MDN : STRINGS.USERNAME,
              value: text,
            });
          }}
          placeholder={t('strings.enterHere')}
          placeholderTextColor={Colors.violet.v200}
          style={styles.textInput}
          maxLength={maxLength}
        />
        {error ? (
          <Text
            label={error}
            fontSize={Typography.fontSize.x18.fontSize}
            color={Colors.error.primary}
            style={[styles.errorText, styles[gcs('contentEnd', inflection, true, ['lg'])]]}
          />
        ) : null}
      </View>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['lg'])]]}>
        <Button
          onPress={onPressLogin}
          label={t(`strings.getOtp`)}
          type={STYLES.TYPE.PRIMARY}
          style={[styles.loginButton, styles[gcs('loginButton', inflection, true, ['lg'])]]}
          labelStyle={styles.buttonLabel}
        />
        <Text label={t(`strings.or`)} fontSize={Sizing.layout.x16} style={styles.text} />
        <Button
          onPress={handleAdLogin}
          label={t(`strings.loginAD`)}
          type={STYLES.TYPE.VIOLET}
          style={[styles.loginButton, styles[gcs('loginButton', inflection, true, ['lg'])]]}
          labelStyle={styles.buttonLabel}
          outline
        />
      </View>
    </>
  );

  const renderOtpVerification = () => (
    <OtpVerification
      mobile={user.mdn}
      queryName={QUERY.loginOtpVerification}
      params={user}
      buttonInfo={{
        otpButtonLabel: STRINGS.LOGIN,
        sentToTitle: STRINGS.SENTTO,
        resendOtpQuery: QUERY.loginWithOtp,
      }}
      setIsOtp={setIsOtp}
    />
  );

  return (
    <SafeAreaView key={isOtp ? 'otp' : 'login'} testID="login" style={[styles.container, styles[gcs('container', inflection, true, ['lg'])]]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? Sizing.layout.x0 : -Sizing.layout.x50}
      >
        <Gradient start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={Colors.gradient.theme} style={styles.container}>
          <View style={[styles.logoContainer, styles[gcs('logoContainer', inflection, true, ['lg', 'md', 'sm', 'xs'])]]}>
            <Image iconName={ICONS.LOGO_NEW} style={styles.image} />
          </View>
          <View style={[styles.card, styles[gcs('card', inflection, true, ['lg', 'md', 'sm', 'xm'])]]}>{!isOtp ? renderLoginWithOtp() : renderOtpVerification()}</View>

          <BottomModal />
        </Gradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default memo(Login);
