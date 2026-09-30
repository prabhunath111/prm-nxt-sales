import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CustomerDetailsCard from './CustomerDetailsCard';

export default {
  title: 'components/CustomerDetailsCard',
  component: CustomerDetailsCard,
} as ComponentMeta<typeof CustomerDetailsCard>;

export const Basic: ComponentStory<typeof CustomerDetailsCard> = (args) => <CustomerDetailsCard {...args} />;

Basic.args = {};
