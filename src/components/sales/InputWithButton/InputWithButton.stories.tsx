import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import InputWithButton from './InputWithButton';

export default {
  title: 'components/InputWithButton',
  component: InputWithButton,
} as ComponentMeta<typeof InputWithButton>;

export const Basic: ComponentStory<typeof InputWithButton> = (args) => <InputWithButton {...args} />;

Basic.args = {};
