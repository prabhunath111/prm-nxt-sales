/**
 * TSRA approval form screen
 *
 * @module components/TsraApprovalSummary
 * @memberof - View Component
 */
import React, { memo, useEffect, useState } from 'react';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import useParams from 'hooks/useParams';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { ParentObject } from 'store/sales/types/common';
import actions from 'store/sales/actions/form';
import uiActions from 'store/sales/actions/ui';
import { SUBMISSION, DYNAMIC_FORM_WIDTH_360PX, DYNAMIC_FORM_WIDTH_70P, PROPERTIES } from 'const';
import { RadioContainer, RegistrationFormBuilder, Text } from 'components/sales';
import { View } from 'react-native';
import { RadioItem } from 'components/sales/RadioContainer';
import { gcs } from 'styles/webBreakpoints';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { DYNAMIC_FORM_WIDTH_80P, FORMS, STRINGS } from 'const/strings';
import { useTranslation } from 'react-i18next';
import styles from './TsraApprovalSummary.styles';

/**
 * Component prop types.
 *
 * @typedef {object} CreateChannelPartnerProps
 */
export type CreateChannelPartnerProps = {
  customFormName?: string;
  formContainerStyle?: object;
  containerStyle?: object;
  stateKey?: string;
};

/**
 * Represents a TsraApprovalSummary component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @returns {JSX.Element} The rendered component.
 */
const TsraApprovalSummary = ({ customFormName = '', formContainerStyle, containerStyle, stateKey }: CreateChannelPartnerProps) => {
  const { routeName } = useCurrentRoute();
  const { selectedTab } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const { t } = useTranslation();
  const { inflection } = useInflection();
  const formName = customFormName || (routeName as FormNameKeys);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(selectedTab);
  const [containerWidthStyle, setContainerWidthStyle] = useState('');
  const { selectedDealer, tsraApprovalListData } = useSelector((state: RootState) => state.tsraApproval);

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
    } else {
      dispatch(actions.submitForm(values, queryName));
    }
  };

  useEffect(() => {
    dispatch(
      actions.setUpdatedFormFields({
        firstName: selectedDealer?.tsraNameNT,
        mobileNumber1: selectedDealer?.tsraMobileNumber,
      }),
    );
    dispatch(actions.setMultipleDropdownOptionsData(tsraApprovalListData?.result));
  }, [selectedDealer, selectedFilter]);

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
  }, [routeName]);

  return (
    <View style={styles.partnerScreen} testID="tsraSummary">
      <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]}>
        <Text label={t(`strings.selectAction`)} style={[styles.itemTextStyle]} required />
        <RadioContainer
          radioItemContainer={styles.radioItemBorder}
          containerStyle={styles.radioContainer}
          items={PROPERTIES.TSRA_APPROVAL.APPROVE_OR_REJECT as RadioItem[]}
          onSelectionChange={(text) => setSelectedFilter(text)}
          selectedValue={selectedFilter}
          selectedContainerStyle={styles.fillPink}
        />
      </View>

      <View style={styles.mainContiner}>
        <RegistrationFormBuilder
          formName={selectedFilter === STRINGS.REJECT ? FORMS.rejectTsra : FORMS.approveTsra}
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

export default memo(TsraApprovalSummary);
