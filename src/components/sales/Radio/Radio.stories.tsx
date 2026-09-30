import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Radio from './Radio';

export default {
  title: 'components/Radio',
  component: Radio,
} as ComponentMeta<typeof Radio>;

export const Basic: ComponentStory<typeof Radio> = (args) => <Radio {...args} />;

Basic.args = {
  text: 'Basic Radio Button',
  isActive: true,
  isSelected: true,
  onPress: () => {},
};
