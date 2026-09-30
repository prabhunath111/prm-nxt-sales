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
import React, { memo, useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Colors, Sizing, Typography } from 'styles';
import { TextInput, Link, Text, Image, Button, Gradient } from 'components/sales';
import { ICONS, PROPERTIES, STRINGS, STYLES } from 'const';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import actions from 'store/sales/actions/user';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';
import { loginValidation } from 'utils/ValidationHelper';
import { useTranslation } from 'react-i18next';
import { fetchLanguageAction } from 'store/sales/actions/fetchLanguage/fetchLanguage.action';
import { changeLanguage } from 'config/i18n';
import useNavigate from 'hooks/useNavigate';
import { safePath } from 'utils/navigationHelper';
import { ROLES_DEFAULT_ROUTES } from 'const/strings';
import styles from './LoginPage.styles';

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the screen
 */

interface User {
  userName: string;
  password: string;
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
const LoginPage = () => {
  const { inflection } = useInflection();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const [user, setUser] = useState<User>({
    userName: '',
    password: '',
    isPrmLogin: true,
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    // set default language to english
    changeLanguage(STRINGS.EN);
  }, []);

  /**
   * Handles the login button press event.
   */
  const onPressLogin = () => {
    const hasError = loginValidation(user);

    if (hasError) {
      setError(hasError);
    } else {
      dispatch(actions.doLogin(user)).then((data: any) => {
        if (data?.internalRoleNT === PROPERTIES.ROLES.asi || data?.internalRoleNT === PROPERTIES.ROLES.csm) {
          dispatch(actions.getAsmCsmMobileName());
          const safeRole = data?.internalRole?.trim() || 'default';
          const redirectPath = safePath(ROLES_DEFAULT_ROUTES[safeRole]);
          navigate(redirectPath);
        }
        dispatch(fetchLanguageAction());
      });
    }
  };

  const handleInputChange = ({ name, value }: InputChangeEvent) => {
    setUser((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  /**
   * Handles the forgot password link press event.
   */
  const onPressForgotPassword = () => {
    // Do something about forgot password operation
  };

  return (
    <SafeAreaView testID="loginPage" style={[styles.container, styles[gcs('container', inflection, true, ['lg'])]]}>
      <Gradient start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={Colors.gradient.theme} style={styles.container}>
        <View style={[styles.card, styles[gcs('card', inflection, true, ['lg'])]]}>
          <View style={[styles.logoContainer, styles[gcs('logoContainer', inflection, true, ['lg'])]]}>
            <Image iconName={ICONS.LOGO} height={Sizing.layout.x4} width={Sizing.layout.x30} />
          </View>
          <View style={[styles.inputContainer, styles[gcs('inputContainer', inflection, true, ['lg'])]]}>
            <TextInput
              inputFieldStyle={[styles.inputText, styles[gcs('inputText', inflection, true, ['lg'])]]}
              onInputChange={(text: string) => handleInputChange({ name: 'userName', value: text })}
              placeholder={t('strings.userName')}
              placeholderTextColor={Colors.neutral.white}
            />
            {error ? (
              <Text
                label={t('errors.userName')}
                fontSize={Typography.fontSize.x18.fontSize}
                color={Colors.error.primary}
                style={[styles.errorText, styles[gcs('contentEnd', inflection, true, ['lg'])]]}
              />
            ) : null}
          </View>

          <View style={[styles.inputContainer, styles[gcs('inputContainer', inflection, true, ['lg'])]]}>
            <TextInput
              inputFieldStyle={[styles.inputText, styles[gcs('inputText', inflection, true, ['lg'])]]}
              onInputChange={(text: string) => handleInputChange({ name: 'password', value: text })}
              secureTextEntry
              placeholder={t('strings.password')}
              placeholderTextColor={Colors.neutral.white}
            />
            {error ? (
              <Text
                label={t('errors.password')}
                fontSize={Typography.fontSize.x18.fontSize}
                color={Colors.error.primary}
                style={[styles.errorText, styles[gcs('contentEnd', inflection, true, ['lg'])]]}
              />
            ) : null}
          </View>

          <View style={[styles.contentCenter, styles[gcs('contentCenter', inflection, true, ['lg'])]]}>
            <View style={[styles.contentStart, styles[gcs('contentStart', inflection, true, ['lg'])]]}>
              <Text style={[styles.versionText, styles[gcs('versionText', inflection, true, ['lg'])]]}>{t('strings.version')} 2.7.7</Text>
            </View>

            <Link
              isNavigation
              onPress={onPressForgotPassword}
              label={t('strings.forgotPassword')}
              linkStyle={[styles.contentEnd, styles[gcs('contentEnd', inflection, true, ['lg'])]]}
              labelStyle={[styles.forgotText, styles[gcs('forgotText', inflection, true, ['lg'])]]}
            />
          </View>
          <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['lg'])]]}>
            <Button onPress={onPressLogin} label={t('login')} type={STYLES.TYPE.SECONDARY} style={[styles.loginButton, styles[gcs('loginButton', inflection, true, ['lg'])]]} />
          </View>
        </View>
      </Gradient>
    </SafeAreaView>
  );
};

export default memo(LoginPage);
