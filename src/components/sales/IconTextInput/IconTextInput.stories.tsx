import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ICONS } from 'const';
import IconTextInput from './IconTextInput';

export default {
  title: 'components/IconTextInput',
  component: IconTextInput,
} as ComponentMeta<typeof IconTextInput>;

export const Basic: ComponentStory<typeof IconTextInput> = (args) => <IconTextInput {...args} />;

Basic.args = {
  leftIconName: ICONS.RUPEE_SYMBOL,
  placeholder: 'Enter amount',
};
