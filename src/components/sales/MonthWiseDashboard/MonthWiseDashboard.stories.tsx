import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MonthWiseDashboard from './MonthWiseDashboard';

export default {
  title: 'components/MonthWiseDashboard',
  component: MonthWiseDashboard,
} as ComponentMeta<typeof MonthWiseDashboard>;

export const Basic: ComponentStory<typeof MonthWiseDashboard> = () => <MonthWiseDashboard />;

Basic.args = {};
