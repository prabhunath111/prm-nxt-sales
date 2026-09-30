import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TransactionDetails from './TransactionDetails';

export default {
  title: 'components/TransactionDetails',
  component: TransactionDetails,
} as ComponentMeta<typeof TransactionDetails>;

export const Basic: ComponentStory<typeof TransactionDetails> = (args) => <TransactionDetails {...args} />;

Basic.args = {};
