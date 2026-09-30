import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import HeaderFilters from './HeaderFilters';

export default {
  title: 'components/HeaderFilters',
  component: HeaderFilters,
} as ComponentMeta<typeof HeaderFilters>;

export const Basic: ComponentStory<typeof HeaderFilters> = (args) => <HeaderFilters {...args} />;

Basic.args = {};
