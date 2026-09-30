import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MultiSelectDropdown from './MultiSelectDropdown';

export default {
  title: 'components/MultiSelectDropdown',
  component: MultiSelectDropdown,
} as ComponentMeta<typeof MultiSelectDropdown>;

export const Basic: ComponentStory<typeof MultiSelectDropdown> = (args) => <MultiSelectDropdown {...args} />;

Basic.args = {};
