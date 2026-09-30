import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MultiCheckbox from './MultiCheckbox';

export default {
  title: 'components/MultiCheckbox',
  component: MultiCheckbox,
} as ComponentMeta<typeof MultiCheckbox>;

export const Basic: ComponentStory<typeof MultiCheckbox> = (args) => <MultiCheckbox {...args} />;

Basic.args = {};
