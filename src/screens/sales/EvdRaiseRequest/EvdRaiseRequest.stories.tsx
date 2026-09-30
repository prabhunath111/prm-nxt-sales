import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EvdRaiseRequest from './EvdRaiseRequest';

export default {
  title: 'components/EvdRaiseRequest',
  component: EvdRaiseRequest,
} as ComponentMeta<typeof EvdRaiseRequest>;

export const Basic: ComponentStory<typeof EvdRaiseRequest> = () => <EvdRaiseRequest />;

Basic.args = {};
