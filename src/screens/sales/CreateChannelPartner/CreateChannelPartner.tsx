/**
 * Create channel partner screen for dealer, FOS and AD
 *
 * @module components/CreateChannelPartner
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { ParentObject } from 'store/sales/types/common';
import actions from 'store/sales/actions/form';
import { sliceActions as formAction } from 'store/sales/reducer/form';
import uiActions from 'store/sales/actions/ui';
import { STATE_KEY, SUBMISSION, DYNAMIC_FORM_WIDTH_360PX, DYNAMIC_FORM_WIDTH_70P, PROPERTIES } from 'const';
import { RadioContainer, RegistrationFormBuilder, Text } from 'components/sales';
import { callAction } from 'utils/formBuilderHelper';
import { View } from 'react-native';
import { RadioItem } from 'components/sales/RadioContainer';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { getGeoLocation } from 'utils/geoLocationHelper';
import { DYNAMIC_FORM_WIDTH_80P, PARTNER_ROLES, QUERY, ROUTE } from 'const/strings';
import { useTranslation } from 'react-i18next';
import { isWeb } from 'utils/platformHelper';
import { LOG } from 'config/logger';
import { MoengageMixpanel } from 'services/moengageMixpanel';
import { MoengageMixpanelModules } from 'services/moengageMixpanel/config';
import styles from './CreateChannelPartner.styles';

/**
 * Component prop types.
 *
 * @typedef {object} CreateChannelPartnerProps
 * @property {string} [text] - The text to display inside the component.
 */
export type CreateChannelPartnerProps = {
  customFormName?: string;
  formContainerStyle?: object;
  containerStyle?: object;
  stateKey?: string;
};

/**
 * Represents a CreateChannelPartner component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const CreateChannelPartner = ({ customFormName = '', formContainerStyle, containerStyle, stateKey }: CreateChannelPartnerProps) => {
  const { routeName } = useCurrentRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const formName = customFormName || (routeName as FormNameKeys);
  const { info } = useSelector((state: RootState) => state.user);
  const [containerWidthStyle, setContainerWidthStyle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { inflection } = useInflection();
  const [locations, setLocations] = useState({});

  const { t } = useTranslation();

  const fetchLocation = async (captureLocation: boolean = false) => {
    try {
      const response = await getGeoLocation();
      if (response) {
        const { latitude, longitude } = response;
        setLocations({ latitude, longitude });
      }
    } catch {
      const error = captureLocation ? t(`errors.captureLocationError`) : t(`errors.locationError`);
      LOG.info(error);
    }
  };

  const captureGeoLocation = () => {
    fetchLocation(true);
    dispatch(callAction({ locations }, QUERY.CaptureLocationAction));
  };

  useEffect(() => {
    const shouldFetchLocation = (isWeb && window.webkit?.messageHandlers?.cordova_iab) || !isWeb;
    if (shouldFetchLocation) {
      fetchLocation();
    }
    dispatch(actions.resetForm());
    dispatch(
      actions.setUpdatedFormFields({
        geoLongitude: '',
        geoLatitude: '',
      }),
    );
    if (selectedFilter && info?.roleId !== PARTNER_ROLES.ASI && info?.roleId !== PARTNER_ROLES.ASM) {
      dispatch(callAction({ user: selectedFilter }, QUERY.GetCCPartnerDetailsBasedOnRole));
    }
    dispatch(actions.setNavigationData({ user: selectedFilter, locations }, '', '', ''));
  }, [selectedFilter]);

  useEffect(() => {
    if (info?.roleId === PARTNER_ROLES.ASI || info?.roleId === PARTNER_ROLES.ASM) {
      dispatch(callAction({}, QUERY.ViewDistributorListForASM));
    }
    if (info?.roleId === PARTNER_ROLES.ASI || info?.roleId === PARTNER_ROLES.ASM) {
      dispatch(callAction({}, QUERY.GetCircleUserNameEmail));
    }
    dispatch(actions.setFormValues(info));
    dispatch(formAction.resetDropdownData({}));
    if (stateKey === STATE_KEY.FORM_STATE) {
      dispatch(uiActions.hideBottomModal());
    }
  }, []);

  const onSubmit = (values: ParentObject, submitType: string, queryName: string, navigateTo: string) => {
    if ((submitType === SUBMISSION.NAVIGATION || submitType === SUBMISSION.NAVIGATION_TO) && navigateTo) {
      dispatch(actions.setNavigationData(values, queryName, formName, routeName));
      navigate(navigateTo);
    } else if ((submitType === SUBMISSION.SUBMIT_NAVIGATION || submitType === SUBMISSION.LINK) && navigateTo) {
      dispatch(actions.setNavigationData(values, queryName, formName, routeName));
      dispatch(actions.submitForm(values, queryName))?.then((response: ParentObject) => {
        if (response?.status) {
          dispatch(uiActions.hideBottomModal());
          navigate(response.route ?? navigateTo);
        }
      });
    } else if (submitType === SUBMISSION.CAPTURE) {
      captureGeoLocation();
    } else {
      dispatch(actions.submitForm(values, queryName));
    }
  };

  useEffect(() => {
    if (DYNAMIC_FORM_WIDTH_360PX.includes(routeName)) {
      setContainerWidthStyle('dynamicCardContainer');
    }
    if (DYNAMIC_FORM_WIDTH_70P.includes(routeName)) {
      setContainerWidthStyle('dynamicCardContainer70P');
    }
    if (DYNAMIC_FORM_WIDTH_80P.includes(routeName)) {
      setContainerWidthStyle('dynamicCardContainer80P');
    }
    if (routeName === ROUTE.WEB.CREATE_CHANNEL_PARTNER) {
      MoengageMixpanel.trackEvent(MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_PageVisit.moduleName, {
        [MoengageMixpanelModules.Manage_Hierarchy.CreateChannelPartner_PageVisit.attributes.Status]: true,
      });
    }
  }, [routeName]);

  const roleKey = selectedFilter?.toUpperCase();
  const renderFormMap = {
    [PROPERTIES.ROLES.fos]: 'createChannelPartnerFos',
    [PROPERTIES.ROLES.ad]: 'createChannelPartnerAd',
  };

  return (
    <View style={styles.partnerScreen}>
      {info?.roleId !== PARTNER_ROLES.fos && (
        <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
          <Text label={t(`strings.selectRole`)} style={[styles.itemTextStyle]} />
          <RadioContainer
            radioItemContainer={styles.radioItemBorder}
            containerStyle={styles.radioContainer}
            items={
              info?.roleId === PARTNER_ROLES.ASI || info?.roleId === PARTNER_ROLES.ASM
                ? PROPERTIES.MANAGE_HIERARCHY.CREATE_PARTNER_FOR_ASM
                : (PROPERTIES.MANAGE_HIERARCHY.CREATE_PARTNER_ROLES as RadioItem[])
            }
            onSelectionChange={(text) => setSelectedFilter(text)}
            selectedValue={selectedFilter}
          />
        </View>
      )}
      <View style={styles.mainContiner}>
        <RegistrationFormBuilder
          formName={roleKey && renderFormMap[roleKey] ? renderFormMap[roleKey] : 'createChannelPartner'}
          onSubmit={onSubmit}
          containerStyle={containerStyle}
          formContainerStyle={formContainerStyle}
          dynamicCardContainerStyle={containerWidthStyle}
          stateKey={stateKey}
        />
      </View>
    </View>
  );
};

export default memo(CreateChannelPartner);
