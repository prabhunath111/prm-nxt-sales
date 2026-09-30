import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EvdBalanceInfo from './EvdBalanceInfo';

export default {
  title: 'components/EvdBalanceInfo',
  component: EvdBalanceInfo,
} as ComponentMeta<typeof EvdBalanceInfo>;

export const Basic: ComponentStory<typeof EvdBalanceInfo> = () => <EvdBalanceInfo />;

Basic.args = {};
