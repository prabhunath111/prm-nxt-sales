/**
 * Success screen for customer and winback offers.
 *
 * @module components/PackageOffersSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, CommonSuccess, CustomerDetailsCard, Image, Text } from 'components/sales';
import { FORMS, ICONS, ROUTE, STATE_KEY, STRINGS, STYLES } from 'const';
import { Sizing } from 'styles';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import formAction from 'store/sales/actions/form';
import useCurrentRoute from 'hooks/useCurrentRoute';
import styles from './PackageOffersSuccess.styles';

/**
 * Represents a PackageOffersSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const PackageOffersSuccess = () => {
  const { t } = useTranslation();
  const { routeName } = useCurrentRoute();

  const { navigate, goHome } = useNavigate();
  const { inflection } = useInflection();
  const { formNavigationData, dealerDetails } = useSelector((state: RootState) => state.form[STATE_KEY.FORM_STATE]);
  const { isRedirection } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();

  const moduleRouteHandler = (route: string, setFormValue: boolean, formkey: string) => {
    if (setFormValue) {
      dispatch(formAction.setFormDependentDefault({ [formkey]: dealerDetails?.subscriberId }));
    }
    navigate(route);
  };

  const checkOffersForAnotherCustomer = () => {
    navigate(ROUTE.WEB.CUSTOMER_OFFERS);
  };

  const navigationHandler = () => navigate(ROUTE.WEB.RECHARGE_WINBACK);

  const renderModuleRow = (iconName: string, moduleName: string) => (
    <Pressable style={styles.moduleContainer} onPress={() => moduleRouteHandler(ROUTE.WEB.RECHARGE_REVERSAL, true, STRINGS.SUBSCRIBER_ID)}>
      <View style={styles.iconStyle}>
        <Image iconName={iconName} height={Sizing.layout.x24} width={Sizing.layout.x24} isDimension={false} />
        <Text style={styles.moduleText}>{t(`forms.${moduleName}`)}</Text>
      </View>
      <Image iconName={ICONS.PINK_CHEVRON_RIGHT} height={Sizing.layout.x24} width={Sizing.layout.x24} isDimension={false} />
    </Pressable>
  );

  return (
    <View style={[styles.mainContainer, styles[gcs('mainContainer', inflection, true, ['md', 'lg', 'xl'])]]} testID="packageOfferSuccessTest">
      <View style={[styles.cardDetailsContainer, styles[gcs('cardDetailsContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CustomerDetailsCard />
      </View>
      <ScrollView contentContainerStyle={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
        <CommonSuccess primaryText={STRINGS.REQUEST_SUCCESSFUL} secondaryText={STRINGS.TRANSECTION_ID} value={formNavigationData?.params?.transactionId} />
        <View style={[styles.cardsContainer, styles[gcs('cardsContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
          <View style={[styles.borderContainer, styles.refreshContainer, styles[gcs('borderContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <Text style={styles.packChangesText}>{t('strings.cantViewPackChangesYet')}</Text>
            <Pressable style={styles.heavyRefresh} onPress={() => moduleRouteHandler(ROUTE.WEB.HEAVY_REFRESH, true, STRINGS.SUBSCRIBER_INFO)}>
              <Image iconName={ICONS.REFRESH_PINK} height={Sizing.layout.x12} width={Sizing.layout.x12} isDimension={false} />
              <Text style={styles.heavyRewfreshText}>{t('forms.heavyRefresh')}</Text>
            </Pressable>
          </View>
          <View style={[styles.borderContainer, styles[gcs('borderContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
            <Text style={styles.moreActionText}>
              {t('strings.moreActionsFor')}
              <Text style={styles.subIdText}> {`${t('strings.subID')}: ${dealerDetails?.subscriberId}`}</Text>
            </Text>
            {renderModuleRow(ICONS.RECHARGE_REVERSAL_PINK, FORMS.rechargeReversal)}
            {/* below commented code Will be added when more modules will come to show */}
            {/* <Text onPress={() => {}} style={[styles.heavyRewfreshText, styles.viewMore]}>
              {t('strings.viewMore')}
            </Text> */}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer, styles[gcs('buttonContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Button
          style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
          label={t('strings.closeCustomerSession')}
          type={STYLES.TYPE.PRIMARY}
          onPress={() => goHome(isRedirection)}
          fontSize={Sizing.layout.x16}
        />
        {routeName === ROUTE.WEB.CUSTOMER_OFFER_SUCCESS ? (
          <Button
            style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            label={t('strings.checkOffersForAnotherCustomer')}
            type={STYLES.TYPE.SECONDARY}
            onPress={checkOffersForAnotherCustomer}
            outline
            fontSize={Sizing.layout.x16}
          />
        ) : (
          <Button
            style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]}
            label={t('strings.rechargeWinBackForAnotherCustomer')}
            type={STYLES.TYPE.SECONDARY}
            onPress={() => navigationHandler()}
            outline
            fontSize={Sizing.layout.x16}
          />
        )}
      </View>
    </View>
  );
};

export default memo(PackageOffersSuccess);
