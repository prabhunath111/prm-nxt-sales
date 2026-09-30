import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Scanner from './Scanner';

export default {
  title: 'components/Scanner',
  component: Scanner,
} as ComponentMeta<typeof Scanner>;

export const Basic: ComponentStory<typeof Scanner> = (args) => <Scanner {...args} />;

Basic.args = {
  onScan: () => {},
  isActive: false,
  isScanner: false,
  isFocusable: false,
};
