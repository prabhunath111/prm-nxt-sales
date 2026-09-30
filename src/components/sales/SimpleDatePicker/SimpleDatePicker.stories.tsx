import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import SimpleDatePicker from './SimpleDatePicker';

export default {
  title: 'components/SimpleDatePicker',
  component: SimpleDatePicker,
} as ComponentMeta<typeof SimpleDatePicker>;

export const Basic: ComponentStory<typeof SimpleDatePicker> = (args) => <SimpleDatePicker {...args} />;

Basic.args = {};
