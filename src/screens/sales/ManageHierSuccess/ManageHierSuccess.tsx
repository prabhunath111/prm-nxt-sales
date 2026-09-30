/**
 * Success screen for manage hierarchy
 *
 * @module components/ManageHierSuccess
 * @memberof - View Component
 */
import React, { memo } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigate';
import { FORMS, ICONS, ROUTE, STYLES } from 'const';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Button, CommonSuccess, Image, Text } from 'components/sales';
import { Sizing } from 'styles';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { PARTNER_ROLES } from 'const/strings';
import styles from './ManageHierSuccess.styles';

/**
 * Represents a ManageHierSuccess component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const ManageHierSuccess = () => {
  const { inflection } = useInflection();
  const { isRedirection, info } = useSelector((state: RootState) => state.user);
  const { ccPartnerSuccessData, successRoleTypeData } = useSelector((state: RootState) => state.manageHierarchy);
  const { navigate, goHome } = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (type: string) => {
    if (type === FORMS.viewMyTeamDetails) {
      navigate(ROUTE.WEB.VIEW_MY_TEAM_DETAILS);
    } else {
      navigate(ROUTE.WEB.CREATE_CHANNEL_PARTNER);
    }
  };

  const moduleRouteHandler = (route: string) => {
    navigate(route);
  };

  const renderModuleRow = (iconName: string, moduleName: string, routeName: string) => (
    <Pressable style={styles.moduleContainer} onPress={() => moduleRouteHandler(routeName)}>
      <View style={styles.iconStyle}>
        <Image iconName={iconName} height={Sizing.layout.x24} width={Sizing.layout.x24} isDimension={false} style={styles.pinkTint} />
        <Text style={styles.moduleText}>{t(`forms.${moduleName}`)}</Text>
      </View>
      <Image iconName={ICONS.PINK_CHEVRON_RIGHT} height={Sizing.layout.x24} width={Sizing.layout.x24} isDimension={false} />
    </Pressable>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.topContainer}>
            <View>
              <CommonSuccess primaryText={ccPartnerSuccessData?.message} />
            </View>
            <View style={[styles.balanceContainer, styles.partnerContainer, styles[gcs('partnerContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              <View style={styles.partnerNameContainer}>
                <Text style={styles.smallTextStyle} label={t('strings.pendingApprovalWith')} />
                <View style={styles.rowContainer}>
                  <Text style={styles.mediumTextStyle} label={ccPartnerSuccessData?.result?.approvalName} />
                  <View style={styles.verticalSeparator} />
                  <Text style={styles.mediumTextStyle} label={ccPartnerSuccessData?.result?.approvalPosition} />
                </View>
              </View>
            </View>
            <View style={[styles.balanceContainer, styles.partnerContainer, styles[gcs('partnerContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
              <View style={styles.partnerNameContainer}>
                {/* Added role based name and id */}
                <Text style={styles.smallTextStyle} label={successRoleTypeData?.role ? t(`strings.${successRoleTypeData?.role}NameId`) : t(`strings.dealerNameId`)} />
                <View style={styles.rowContainer}>
                  <Text style={styles.mediumTextStyle} label={ccPartnerSuccessData?.result?.partnerUserName} />
                  <View style={styles.verticalSeparator} />
                  <Text style={styles.regularTextStyle} label={ccPartnerSuccessData?.result?.partnerUserId} />
                </View>
              </View>
            </View>
            {info?.roleId === PARTNER_ROLES.fos ? (
              <View style={[styles.borderContainer, styles[gcs('borderContainer', inflection, true, ['md', 'lg', 'xl'])]]}>
                <Text style={styles.moreActionText}>{t('strings.moreActionsForYou')}</Text>
                {renderModuleRow(ICONS.CREATE_NEW_DEALER, FORMS.createNewDealer, ROUTE.WEB.CREATE_CHANNEL_PARTNER)}
                {renderModuleRow(ICONS.VIEW_NEW_DEALER, FORMS.viewNewDealer, ROUTE.WEB.VIEW_NEW_DEALERS)}
                {/* {renderModuleRow(ICONS.REPORTS, FORMS.createDealerStock, '')} */}
              </View>
            ) : (
              <>
                <Pressable
                  onPress={() => handleNavigation(FORMS.createChannelPartner)}
                  style={[styles.navigationContainer, styles[gcs('navigationContainer', inflection, true, ['md', 'lg', 'xl'])]]}
                >
                  <View style={styles.leftIcon}>
                    <Image iconName={ICONS.CREATE_CHANNEL_PARTNER} style={styles.chevronImageStyle} />
                  </View>
                  <Text style={styles.navigationTextStyle} label={t('strings.createAnotherChannelPartner')} />
                  <View style={styles.rightIcon}>
                    <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronImageStyle} />
                  </View>
                </Pressable>
                {info?.roleId === PARTNER_ROLES.ASI || info?.roleId === PARTNER_ROLES.ASM ? (
                  successRoleTypeData.tsra === 'no' && (
                    <Pressable
                      onPress={() => moduleRouteHandler(ROUTE.WEB.PARTNER_APPROVAL)}
                      style={[styles.navigationContainer, styles[gcs('navigationContainer', inflection, true, ['md', 'lg', 'xl'])]]}
                    >
                      <View style={styles.leftIcon}>
                        <Image iconName={ICONS.VIEW_MY_TEAMS} style={styles.chevronImageStyle} />
                      </View>
                      <Text style={styles.navigationTextStyle} label={t('strings.partnerApproval')} />
                      <View style={styles.rightIcon}>
                        <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronImageStyle} />
                      </View>
                    </Pressable>
                  )
                ) : (
                  <Pressable
                    onPress={() => handleNavigation(FORMS.viewMyTeamDetails)}
                    style={[styles.navigationContainer, styles[gcs('navigationContainer', inflection, true, ['md', 'lg', 'xl'])]]}
                  >
                    <View style={styles.leftIcon}>
                      <Image iconName={ICONS.VIEW_MY_TEAMS} style={styles.chevronImageStyle} />
                    </View>
                    <Text style={styles.navigationTextStyle} label={t('strings.viewMyTeamDetails')} />
                    <View style={styles.rightIcon}>
                      <Image iconName={ICONS.PINK_CHEVRON_RIGHT} style={styles.chevronImageStyle} />
                    </View>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => goHome(isRedirection)}
          iconHeight={Sizing.layout.x15}
          iconName={ICONS.HOME}
          fontSize={Sizing.layout.x14}
          iconWidth={Sizing.layout.x15}
          iconPosition={STYLES.POSITION.LEFT}
          isDimension={false}
          label={t('strings.backToHome')}
          style={styles.buttonStyle}
        />
      </View>
    </View>
  );
};

export default memo(ManageHierSuccess);
