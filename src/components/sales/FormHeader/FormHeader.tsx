/**
 * we will have form header based on form screen
 *
 * @module components/FormHeader
 * @memberof CommonComponent
 */

import React from 'react';
import { View } from 'react-native';
import { Sizing } from 'styles';
import Image from 'components/sales/Image';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import Text from 'components/sales/Text';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import { useTranslation } from 'react-i18next';
import styles from './FormHeader.styles';

/**
 * Component type definitions
 *
 * @typedef {object} FormHeaderProps
 * @property {string} [text] - The content for the component
 */

export type FormHeaderProps = {
  formName: FormNameKeys;
};

/**
 * Represents a FormHeader component
 *
 * @param {object} props - React properties passed from composition
 * @param {string} [props.text] - The content for the component
 * @returns {JSX.Element} The rendered FormHeader component
 *
 * @example
 * <FormHeader text="Hello World!" />
 */

const FormHeader = ({ formName }: FormHeaderProps) => {
  const { inflection } = useInflection();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, styles[gcs('container', inflection, true, ['md', 'lg', 'xl'])]]} testID="header-test">
      <Image iconName={`icons/icons_${formName}.png`} height={Sizing.layout.x60} width={Sizing.layout.x60} isDimension={false} style={styles.imageStyle} />
      <Text style={[styles.textStyle, styles[gcs('textStyle', inflection, true, ['md', 'lg', 'xl'])]]} label={t(`forms.${formName}`)} />
    </View>
  );
};

export default FormHeader;
