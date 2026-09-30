import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RegisterPaymentOptions from './RegisterPaymentOptions';

export default {
  title: 'components/RegisterPaymentOptions',
  component: RegisterPaymentOptions,
} as ComponentMeta<typeof RegisterPaymentOptions>;

export const Basic: ComponentStory<typeof RegisterPaymentOptions> = () => <RegisterPaymentOptions />;

Basic.args = {};
