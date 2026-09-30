import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TransactionHistory from './TransactionHistory';

export default {
  title: 'components/TransactionHistory',
  component: TransactionHistory,
} as ComponentMeta<typeof TransactionHistory>;

export const Basic: ComponentStory<typeof TransactionHistory> = () => <TransactionHistory />;

Basic.args = {};
