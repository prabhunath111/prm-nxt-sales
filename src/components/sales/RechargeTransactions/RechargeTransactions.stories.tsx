import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RechargeTransactions from './RechargeTransactions';

export default {
  title: 'components/RechargeTransactions',
  component: RechargeTransactions,
} as ComponentMeta<typeof RechargeTransactions>;

export const Basic: ComponentStory<typeof RechargeTransactions> = () => <RechargeTransactions />;
