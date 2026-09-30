import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RazorpayPayment from './RazorpayPayment';

export default {
  title: 'components/RazorpayPayment',
  component: RazorpayPayment,
} as ComponentMeta<typeof RazorpayPayment>;

export const Basic: ComponentStory<typeof RazorpayPayment> = () => <RazorpayPayment />;

Basic.args = {};
