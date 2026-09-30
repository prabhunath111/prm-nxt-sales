import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CustomerActions from './CustomerActions';

export default {
  title: 'components/CustomerActions',
  component: CustomerActions,
} as ComponentMeta<typeof CustomerActions>;

export const Basic: ComponentStory<typeof CustomerActions> = () => <CustomerActions />;

Basic.args = {};
