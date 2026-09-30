import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MultiFilters from './MultiFilters';

export default {
  title: 'components/MultiFilters',
  component: MultiFilters,
} as ComponentMeta<typeof MultiFilters>;

export const Basic: ComponentStory<typeof MultiFilters> = (args) => <MultiFilters {...args} />;

Basic.args = {};
