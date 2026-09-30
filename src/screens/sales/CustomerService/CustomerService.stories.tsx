import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CustomerService from './CustomerService';

export default {
  title: 'components/CustomerService',
  component: CustomerService,
} as ComponentMeta<typeof CustomerService>;

export const Basic: ComponentStory<typeof CustomerService> = () => <CustomerService />;

Basic.args = {};
