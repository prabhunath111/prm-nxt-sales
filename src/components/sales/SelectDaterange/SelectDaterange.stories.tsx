import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import SelectDaterange from './SelectDaterange';

export default {
  title: 'components/SelectDaterange',
  component: SelectDaterange,
} as ComponentMeta<typeof SelectDaterange>;

export const Basic: ComponentStory<typeof SelectDaterange> = (args) => <SelectDaterange {...args} />;

Basic.args = {};
