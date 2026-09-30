import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Transaction from './Transaction';

export default {
  title: 'components/Transaction',
  component: Transaction,
} as ComponentMeta<typeof Transaction>;

export const Basic: ComponentStory<typeof Transaction> = () => <Transaction />;

Basic.args = {};
