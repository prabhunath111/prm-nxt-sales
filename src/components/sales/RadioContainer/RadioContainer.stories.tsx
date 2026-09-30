import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RadioContainer from './RadioContainer';

export default {
  title: 'components/RadioContainer',
  component: RadioContainer,
} as ComponentMeta<typeof RadioContainer>;

export const Basic: ComponentStory<typeof RadioContainer> = (args) => <RadioContainer {...args} />;

Basic.args = {
  items: [{ text: 'Forward Transfer' }, { text: 'Reverse Transfer' }],
  onSelectionChange: () => {},
  selectedValue: 'Forward Transfer',
};
