import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ChartWrapper from './ChartWrapper';

export default {
  title: 'components/ChartWrapper',
  component: ChartWrapper,
} as ComponentMeta<typeof ChartWrapper>;

export const Basic: ComponentStory<typeof ChartWrapper> = () => <ChartWrapper />;

Basic.args = {};
