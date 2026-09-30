import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EvdRaiseRequestSuccess from './EvdRaiseRequestSuccess';

export default {
  title: 'components/EvdRaiseRequestSuccess',
  component: EvdRaiseRequestSuccess,
} as ComponentMeta<typeof EvdRaiseRequestSuccess>;

export const Basic: ComponentStory<typeof EvdRaiseRequestSuccess> = () => <EvdRaiseRequestSuccess />;

Basic.args = {};
