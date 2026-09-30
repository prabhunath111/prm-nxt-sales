/**
 * Common screen for modules generated with form json.
 *
 * @module components/DynamicSalesNext
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
import { STATE_KEY, SUBMISSION, DYNAMIC_FORM_WIDTH_360PX, DYNAMIC_FORM_WIDTH_70P, DYNAMIC_FORM_WIDTH_50P, DYNAMIC_FORM_WIDTH_80P, DYNAMIC_FORM_WIDTH_100P } from 'const';
import DynamicFormBuilder from 'components/sales/DynamicFormBuilder';
import { DYNAMIC_FORM_WIDTH_50P_WITH_PADDING } from 'const/strings';

/**
 * Component type definitions
 *
 * @typedef {object} BottomModalProps
 * @property {boolean} [isModalVisible] - Modal visibility toggle
 * @property {ReactNode} [children] - Content to be rendered inside the modal
 * @property {function} [onClose] - Function to close the modal
 * @property {string} [headerTitle] - Title to be displayed in the modal header
 * @property {boolean} [showHeader] - Flag to determine if the header should be shown
 */

export type DynamicSalesNextProps = {
  customFormName?: string;
  formContainerStyle?: object;
  containerStyle?: object;
  stateKey?: string;
};

/**
 * Represents a SalesNext component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const DynamicSalesNext = ({ customFormName = '', formContainerStyle, containerStyle, stateKey }: DynamicSalesNextProps) => {
  const { routeName } = useCurrentRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const formName = customFormName || (routeName as FormNameKeys);
  const { info } = useSelector((state: RootState) => state.user);
  const [containerWidthStyle, setContainerWidthStyle] = useState('');

  useEffect(() => {
    dispatch(actions.setFormValues(info));
    dispatch(formAction.resetDropdownData({}));
    if (stateKey === STATE_KEY.FORM_STATE) {
      dispatch(uiActions.hideBottomModal());
    }
  }, []);

  useEffect(() => {
    if (DYNAMIC_FORM_WIDTH_360PX.includes(routeName)) {
      setContainerWidthStyle('dynamicCardContainer');
    }
    if (DYNAMIC_FORM_WIDTH_50P.includes(routeName)) {
      setContainerWidthStyle('dynamicCardContainer50P');
    }
    if (DYNAMIC_FORM_WIDTH_70P.includes(routeName)) {
      setContainerWidthStyle('dynamicCardContainer70P');
    }
    if (DYNAMIC_FORM_WIDTH_80P.includes(routeName)) {
      setContainerWidthStyle('dynamicCardContainer80P');
    }
    if (DYNAMIC_FORM_WIDTH_100P.includes(routeName)) {
      setContainerWidthStyle('dynamicCardContainer100P');
    }
    if (DYNAMIC_FORM_WIDTH_50P_WITH_PADDING.includes(routeName)) {
      setContainerWidthStyle('dynamicCardContainer50PWithPadding');
    }
  }, [routeName]);

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
      dispatch(actions.submitForm(values, queryName, '', navigate));
    }
  };
  return (
    <DynamicFormBuilder
      formName={formName}
      onSubmit={onSubmit}
      containerStyle={containerStyle}
      formContainerStyle={formContainerStyle}
      dynamicCardContainerStyle={containerWidthStyle}
      stateKey={stateKey}
    />
  );
};

export default memo(DynamicSalesNext);
