import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TransactionCard from './TransactionCard';

export default {
  title: 'components/TransactionCard',
  component: TransactionCard,
} as ComponentMeta<typeof TransactionCard>;

export const Basic: ComponentStory<typeof TransactionCard> = (args) => <TransactionCard {...args} />;

Basic.args = {};
