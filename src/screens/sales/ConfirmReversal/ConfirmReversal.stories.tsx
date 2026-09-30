import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ConfirmReversal from './ConfirmReversal';

export default {
  title: 'components/ConfirmReversal',
  component: ConfirmReversal,
} as ComponentMeta<typeof ConfirmReversal>;

export const Basic: ComponentStory<typeof ConfirmReversal> = () => <ConfirmReversal />;

Basic.args = {};
