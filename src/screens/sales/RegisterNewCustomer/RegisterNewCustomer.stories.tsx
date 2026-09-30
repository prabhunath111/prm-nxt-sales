import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RegisterNewCustomer from './RegisterNewCustomer';

export default {
  title: 'components/RegisterNewCustomer',
  component: RegisterNewCustomer,
} as ComponentMeta<typeof RegisterNewCustomer>;

export const Basic: ComponentStory<typeof RegisterNewCustomer> = () => <RegisterNewCustomer />;

Basic.args = {};
