/**
 * to handle form and its header dynamically
 *
 * @module components/FormWrapper
 * @memberof CommonComponent
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import actions from 'store/sales/actions/form';
import { ParentObject } from 'store/sales/types/common';
import { View } from 'react-native';
import FormHeader from 'components/sales/FormHeader';
import FormBuilder from 'components/sales/FormBuilder';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import { STATE_KEY } from 'const';
import styles from './FormWrapper.styles';

/**
 * Component type definitions
 *
 * @typedef {object} FormWrapperProps
 * @property {string} [text] - The content for the component
 */

export type FormWrapperProps = {
  formName: FormNameKeys;
  style?: object;
  isHeaderRequire?: boolean;
  onSubmit: (values: ParentObject, submitType: string, queryName: string, routeName: string) => void;
};

/**
 * Represents a FormWrapper component
 *
 * @param {object} props - React properties passed from composition
 * @param {object} [props.style] - The content for the component
 * @returns {JSX.Element} The rendered FormWrapper component
 *
 * @example
 * <FormWrapper text="Hello World!" />
 */

const FormWrapper = ({ formName, onSubmit, style, isHeaderRequire, ...props }: FormWrapperProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.redirection);
  const { formDependentDefault } = useSelector((state: RootState) => state.form[STATE_KEY.FORM_STATE]);
  const { inflection } = useInflection();

  useEffect(() => {
    if (data && !formDependentDefault) {
      dispatch(actions.setFormDependentDefault(data));
    }
    return () => dispatch(actions.setFormDependentDefault(data));
  }, [dispatch, data]);

  return (
    <View style={styles.container} testID="form-wrapper">
      <View style={[styles.header, styles[gcs('header', inflection, true, ['md', 'lg', 'xl'])]]}>{isHeaderRequire ? <FormHeader formName={formName} /> : null}</View>
      <FormBuilder onSubmit={onSubmit} formName={formName} style={style} formValues={formDependentDefault} {...props} />
    </View>
  );
};

export default FormWrapper;
