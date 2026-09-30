import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DynamicSalesNext from './DynamicSalesNext';

export default {
  title: 'components/DynamicSalesNext',
  component: DynamicSalesNext,
} as ComponentMeta<typeof DynamicSalesNext>;

export const Basic: ComponentStory<typeof DynamicSalesNext> = (args) => <DynamicSalesNext {...args} />;

Basic.args = {};
