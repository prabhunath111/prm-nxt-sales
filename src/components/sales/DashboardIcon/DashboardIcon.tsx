/**
 * Represents a single item in the menu
 *
 * @module components/DashboardIcon
 * @memberof - Common Component
 */
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import useNavigate from 'hooks/useNavigate';
import { CHILD_TYPE, HEADER_TITLE, ICONS, MODAL, PROPERTIES, QUERY, ROUTE, STRINGS } from 'const';
import Text from 'components/sales/Text';
import Image from 'components/sales/Image';
import uiActions from 'store/sales/actions/ui';
import demoBoxDetailsAction from 'store/sales/actions/demoBoxDetails';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { callAction } from 'utils/formBuilderHelper';
import env from 'config/env';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './DashboardIcon.styles';

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type DashboardIconProps = {
  label: string;
  value: string;
  isModal?: boolean;
  iconName?: string;
  isDisable?: boolean;
};

/**
 * Represents a DashboardIcon component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns DashboardIcon
 */
const DashboardIcon = ({ label, value, isModal, iconName, isDisable }: DashboardIconProps) => {
  const { navigate } = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { info } = useSelector((state: RootState) => state.user);
  const { inflection } = useInflection();

  const goToURL = () => {
    if (isDisable) {
      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          type: CHILD_TYPE.LABEl,
          headerTitle: HEADER_TITLE.CONFIRMATION,
          showCloseIcon: true,
          showHeader: false,
          buttonInfo: {
            primaryButtonLabel: MODAL.OK,
            childData: HEADER_TITLE.THIS_MODULE_IS_NOT_APPLICABLE,
            centerLabel: true,
          },
        }),
      );
      return undefined;
    }
    if (value === ROUTE.WEB.DEMO_BOX_DETAIL && info?.internalRole === PROPERTIES.ROLES.dealer) {
      dispatch(demoBoxDetailsAction.demoBoxDetails({ evdCode: info.userId }, QUERY.DemoBoxDetails));
      navigate(ROUTE.WEB.DEMO_BOX_DETAILS);
      return undefined;
    }
    // This should be enabled when required------
    // if (
    //   (value === ROUTE.WEB.EVD_TRANSFER && info?.internalRole === PROPERTIES.ROLES.asi) ||
    //   (value === ROUTE.WEB.EVD_TRANSFER && info?.internalRole === PROPERTIES.ROLES.employee)
    // ) {
    //   dispatch(
    //     uiActions.showBottomModal({
    //       isModalVisible: true,
    //       type: CHILD_TYPE.LABEl,
    //       headerTitle: HEADER_TITLE.CONFIRMATION,
    //       showCloseIcon: true,
    //       showHeader: false,
    //       buttonInfo: {
    //         primaryButtonLabel: MODAL.OK,
    //         childData: HEADER_TITLE.THIS_MODULE_IS_NOT_APPLICABLE,
    //         centerLabel: true,
    //       },
    //     }),
    //   );
    //   return undefined;
    // }
    if (isModal) {
      const modalType = value === ROUTE.WEB.PRIMARY_TV_REGISTRATION ? CHILD_TYPE.REGISTRATION_SALES_NEXT_FORM : CHILD_TYPE.DYNAMIC_FORM;

      dispatch(
        uiActions.showBottomModal({
          isModalVisible: true,
          isCenterModal: true,
          type: modalType,
          headerTitle: label,
          showCloseIcon: true,
          showHeader: true,
          formName: value,
          headerIcon: iconName,
        }),
      );

      return undefined;
    }

    if (value === ROUTE.WEB.DASHBOARD) {
      dispatch(callAction({ moduleName: STRINGS.DASHBOARD, externalUrl: env.DASHBOARD_EXTERNAL_URL }, QUERY.GetSSORedirectionToken));
      return undefined;
    }
    if (value === ROUTE.WEB.DEALER_STOCK) {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.DealerStock.DealerStockPageVisit.moduleName, {
        [MoengageMixpanelModules.DealerStock.DealerStockPageVisit.attributes.Status]: true,
      });
    }
    return navigate(value);
  };

  return (
    <TouchableOpacity style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])]]} onPress={goToURL}>
      <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
        {iconName && <Image iconName={ICONS[iconName as keyof typeof ICONS]} style={styles.chevronIconStyle} />}
        <Text style={styles.iconText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DashboardIcon;
