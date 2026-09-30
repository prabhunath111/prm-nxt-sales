import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BingeRetailer from './BingeRetailer';

export default {
  title: 'components/BingeRetailer',
  component: BingeRetailer,
} as ComponentMeta<typeof BingeRetailer>;

export const Basic: ComponentStory<typeof BingeRetailer> = () => <BingeRetailer />;

Basic.args = {
  text: 'Sample Screen',
};
