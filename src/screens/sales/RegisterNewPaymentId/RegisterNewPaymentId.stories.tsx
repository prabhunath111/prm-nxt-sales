import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RegisterNewPaymentId from './RegisterNewPaymentId';

export default {
  title: 'components/RegisterNewPaymentId',
  component: RegisterNewPaymentId,
} as ComponentMeta<typeof RegisterNewPaymentId>;

export const Basic: ComponentStory<typeof RegisterNewPaymentId> = () => <RegisterNewPaymentId />;

Basic.args = {};
