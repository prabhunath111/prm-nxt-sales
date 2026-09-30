import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CumulativeDashboard from './CumulativeDashboard';

export default {
  title: 'components/CumulativeDashboard',
  component: CumulativeDashboard,
} as ComponentMeta<typeof CumulativeDashboard>;

export const Basic: ComponentStory<typeof CumulativeDashboard> = () => <CumulativeDashboard />;

Basic.args = {};
