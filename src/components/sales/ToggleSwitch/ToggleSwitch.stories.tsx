import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ToggleSwitch from './ToggleSwitch';

export default {
  title: 'components/ToggleSwitch',
  component: ToggleSwitch,
} as ComponentMeta<typeof ToggleSwitch>;

export const Basic: ComponentStory<typeof ToggleSwitch> = (args) => <ToggleSwitch {...args} />;

Basic.args = {};
