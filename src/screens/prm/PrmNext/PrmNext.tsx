/**
 * Common screen for modules generated with form json.
 *
 * @module components/PrmNext
 * @memberof - View Component
 */
import React, { memo, useEffect } from 'react';
import useCurrentRoute from 'hooks/useCurrentRoute';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import useNavigate from 'hooks/useNavigate';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { ParentObject } from 'store/sales/types/common';
import actions from 'store/sales/actions/form';
import uiActions from 'store/sales/actions/ui';
import { SUBMISSION } from 'const';
import { SalesFormBuilder } from 'components/sales';

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

export type PrmNextProps = {
  customFormName?: string;
  formContainerStyle?: object;
  containerStyle?: object;
  stateKey?: string;
};

/**
 * Represents a PrmNext component.
 *
 * @component
 * @param {object} props - React properties passed from composition.
 * @param {string} [props.text] - The text to display inside the component.
 * @returns {JSX.Element} The rendered component.
 */
const PrmNext = ({ customFormName = '', formContainerStyle, containerStyle, stateKey }: PrmNextProps) => {
  const { routeName } = useCurrentRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigate();
  const formName = customFormName || (routeName as FormNameKeys);
  const { info } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(actions.setFormValues(info));
  }, []);

  const onSubmit = (values: ParentObject, submitType: string, queryName: string, navigateTo: string) => {
    if (submitType === SUBMISSION.NAVIGATION && navigateTo) {
      dispatch(actions.setNavigationData(values, queryName, formName, routeName));
      navigate(navigateTo);
    } else if (submitType === SUBMISSION.SUBMIT_NAVIGATION && navigateTo) {
      dispatch(actions.setNavigationData(values, queryName, formName, routeName));
      dispatch(actions.submitForm(values, queryName)).then((response: ParentObject) => {
        if (response?.status) {
          dispatch(uiActions.hideBottomModal());
          navigate(response.route ?? navigateTo);
        }
      });
    } else {
      dispatch(actions.submitForm(values, queryName));
    }
  };
  return <SalesFormBuilder formName={formName} onSubmit={onSubmit} containerStyle={containerStyle} formContainerStyle={formContainerStyle} stateKey={stateKey} />;
};

export default memo(PrmNext);
