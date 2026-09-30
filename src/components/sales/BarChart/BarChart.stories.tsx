import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BarChart from './BarChart';

export default {
  title: 'components/BarChart',
  component: BarChart,
} as ComponentMeta<typeof BarChart>;

export const Basic: ComponentStory<typeof BarChart> = (args) => <BarChart {...args} />;

Basic.args = {};
