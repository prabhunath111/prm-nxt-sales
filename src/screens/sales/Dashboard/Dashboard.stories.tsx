import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Dashboard from './Dashboard';

export default {
  title: 'components/Dashboard',
  component: Dashboard,
} as ComponentMeta<typeof Dashboard>;

export const Basic: ComponentStory<typeof Dashboard> = () => <Dashboard />;

Basic.args = {
  text: 'Sample Screen',
};
