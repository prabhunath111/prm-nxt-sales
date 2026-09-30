import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Gradient from './Gradient';

export default {
  title: 'components/Gradient',
  component: Gradient,
} as ComponentMeta<typeof Gradient>;

export const Basic: ComponentStory<typeof Gradient> = (args) => <Gradient {...args} />;

Basic.args = {
  colors: [],
};
