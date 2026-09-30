import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DynamicFormBuilder from './DynamicFormBuilder';

export default {
  title: 'components/DynamicFormBuilder',
  component: DynamicFormBuilder,
} as ComponentMeta<typeof DynamicFormBuilder>;

export const Basic: ComponentStory<typeof DynamicFormBuilder> = (args) => <DynamicFormBuilder {...args} />;

Basic.args = {};
