import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BingeRetailerDashboard from './BingeRetailerDashboard';

export default {
  title: 'components/BingeRetailerDashboard',
  component: BingeRetailerDashboard,
} as ComponentMeta<typeof BingeRetailerDashboard>;

export const Basic: ComponentStory<typeof BingeRetailerDashboard> = () => <BingeRetailerDashboard />;

Basic.args = {
  text: 'Sample Screen',
};
