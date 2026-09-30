import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MaterialsSummary from './MaterialsSummary';

export default {
  title: 'components/MaterialsSummary',
  component: MaterialsSummary,
} as ComponentMeta<typeof MaterialsSummary>;

export const Basic: ComponentStory<typeof MaterialsSummary> = () => <MaterialsSummary />;

Basic.args = {};
