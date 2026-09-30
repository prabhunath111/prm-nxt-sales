/**
 * modify pack screen to display some items
 *
 * @module components/ModifyPack
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View } from 'react-native';
import { gcs } from 'styles/webBreakpoints';
import { Button, TextContainer } from 'components/sales';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { PROPERTIES, ROUTE, STRINGS, STYLES } from 'const';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useTranslation } from 'react-i18next';
import { redirectToManagePackViaPost } from 'utils/navigationHelper';
import useNavigate from 'hooks/useNavigate';
import { getRedirectionLangPayload } from 'utils/languageHelper';
import { isWeb } from 'utils/platformHelper';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './ModifyPack.styles';

/**
 * Represents a ModifyPack component.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const ModifyPack = () => {
  const { inflection } = useInflection();
  const { packSelectorAccountInfo } = useSelector((state: RootState) => state.modifyPack);
  const { rmn, checksum, subscriberId, subscriberName, subscriberNameNT, agentUserId, redirectionUrl } = packSelectorAccountInfo;
  const { t, i18n } = useTranslation();
  const { goBack, navigate } = useNavigate();

  const handleManagePackRedirect = () => {
    MoengageMixpanel.trackEvent(MoengageMixpanelModules.ModifyPack.ModifyPack_Proceed.moduleName, {
      [MoengageMixpanelModules.ModifyPack.ModifyPack_Proceed.attributes.Status]: true,
      [MoengageMixpanelModules.ModifyPack.ModifyPack_Proceed.attributes.SubscriberID]: subscriberId,
    });
    const payload = {
      checksum,
      id: subscriberId,
      name: subscriberNameNT,
      lang: getRedirectionLangPayload(i18n.language),
      // src:source,
      src: 'PSNMSALES',
      agentId: agentUserId,
      redirectionUrl,
    };
    if (isWeb || window.webkit?.messageHandlers?.cordova_iab) {
      redirectToManagePackViaPost(payload);
    } else {
      navigate(ROUTE.WEB.REDIRECT_TO_MANAGE_PACK);
    }
  };

  const maskMobileNumber = (number: string | undefined | null, options = { start: 2, end: 2, maskChar: '*' }): string => {
    if (!number) return STRINGS.NA; // defensive check for undefined/null/empty string

    const { start, end, maskChar } = options;

    if (start + end > number.length) {
      return maskChar.repeat(number.length); // optional: could just return `number`
    }

    const startPart = number.slice(0, start);
    const endPart = number.slice(-end);
    const maskedLength = number.length - start - end;
    const masked = maskChar.repeat(maskedLength);

    return `${startPart}${masked}${endPart}`;
  };

  return (
    <View style={styles.container} testID="modifyPack-test">
      <View style={[styles.subContainer, styles[gcs('subContainer', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
        <TextContainer
          itemContainerStyle={styles.textWrapperManage}
          secondaryStyle={[styles.secondaryStyle, styles[gcs('secondaryStyle', inflection, true, ['xs', 'sm'])]]}
          data={{
            mobileNum: maskMobileNumber(rmn),
            subscriberNameMp: subscriberName,
            subscriberIdMp: subscriberId,
          }}
          dataArray={PROPERTIES.MODIFY_PACK.CUSTOMER_DETAILS}
          primaryStyle={[styles.primaryStyle, styles[gcs('primaryStyle', inflection, true, ['xs', 'sm'])]]}
          textContainerStyle={[styles.textContainerStyle, styles[gcs('textContainerStyle', inflection, true, ['md', 'lg', 'xl'])]]}
          hasSepratorRight
        />

        <View style={[styles.buttonView, styles[gcs('buttonView', inflection, true, ['xs', 'sm', 'md', 'lg', 'xl'])]]}>
          <Button label={t(`strings.proceed`)} onPress={handleManagePackRedirect} style={styles.button} />
          <Button label={t(`strings.cancel`)} onPress={() => goBack()} style={styles.button} type={STYLES.TYPE.SECONDARY} outline />
        </View>
      </View>
    </View>
  );
};

export default memo(ModifyPack);
