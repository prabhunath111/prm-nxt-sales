import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FORMS } from 'const/strings';
import { FormNameKeys } from 'screens/sales/Sales/Sales';
import FormHeader from './FormHeader';

export default {
  title: 'components/FormHeader',
  component: FormHeader,
} as ComponentMeta<typeof FormHeader>;

export const Basic: ComponentStory<typeof FormHeader> = (args) => <FormHeader {...args} />;

Basic.args = {
  formName: FORMS.customerInformation as FormNameKeys,
};
