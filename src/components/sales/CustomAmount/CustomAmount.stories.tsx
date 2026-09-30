import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CustomAmount from './CustomAmount';

export default {
  title: 'components/CustomAmount',
  component: CustomAmount,
} as ComponentMeta<typeof CustomAmount>;

export const Basic: ComponentStory<typeof CustomAmount> = (args) => <CustomAmount {...args} />;

Basic.args = {
  onAmountChange: () => {},
  radioTextArr: ['Full Amount', 'Custom Amount'],
  userDetails: { name: 'John', walletBalance: '1000' },
  headerLabel: 'Select an Amount',
};
