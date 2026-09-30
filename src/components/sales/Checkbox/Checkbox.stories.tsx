import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Checkbox from './Checkbox';

export default {
  title: 'components/Checkbox',
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

export const Basic: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

Basic.args = {
  label: 'Sample checkbox',
  value: false,
};
