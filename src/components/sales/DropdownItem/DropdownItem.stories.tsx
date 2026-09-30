import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DropdownItem from './DropdownItem';

export default {
  title: 'components/DropdownItem',
  component: DropdownItem,
} as ComponentMeta<typeof DropdownItem>;

export const Basic: ComponentStory<typeof DropdownItem> = (args) => <DropdownItem {...args} />;

Basic.args = {
  onPress: () => ({}),
  id: 'Test',
  label: 'Test',
  hasNoOptionText: false,
};
