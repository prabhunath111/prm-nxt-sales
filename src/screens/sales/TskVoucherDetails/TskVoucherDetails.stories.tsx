import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TskVoucherDetails from './TskVoucherDetails';

export default {
  title: 'components/TskVoucherDetails',
  component: TskVoucherDetails,
} as ComponentMeta<typeof TskVoucherDetails>;

export const Basic: ComponentStory<typeof TskVoucherDetails> = () => <TskVoucherDetails />;

Basic.args = {};
