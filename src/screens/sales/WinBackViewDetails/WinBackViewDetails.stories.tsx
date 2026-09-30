import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import WinBackViewDetails from './WinBackViewDetails';

export default {
  title: 'components/WinBackViewDetails',
  component: WinBackViewDetails,
} as ComponentMeta<typeof WinBackViewDetails>;

export const Basic: ComponentStory<typeof WinBackViewDetails> = () => <WinBackViewDetails />;

Basic.args = {
  text: 'Sample Screen',
};
