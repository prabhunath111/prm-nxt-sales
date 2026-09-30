import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MultiCheckboxDropdown from './MultiCheckboxDropdown';

export default {
  title: 'components/MultiCheckboxDropdown',
  component: MultiCheckboxDropdown,
} as ComponentMeta<typeof MultiCheckboxDropdown>;

export const Basic: ComponentStory<typeof MultiCheckboxDropdown> = (args) => <MultiCheckboxDropdown {...args} />;

Basic.args = {};
