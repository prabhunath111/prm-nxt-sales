import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BingeViewDetails from './BingeViewDetails';

export default {
  title: 'components/BingeViewDetails',
  component: BingeViewDetails,
} as ComponentMeta<typeof BingeViewDetails>;

export const Basic: ComponentStory<typeof BingeViewDetails> = () => <BingeViewDetails />;

Basic.args = {
  text: 'Sample Screen',
};
