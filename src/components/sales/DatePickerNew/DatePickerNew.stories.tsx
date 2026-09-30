import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DatePickerNew from './DatePickerNew';

export default {
  title: 'components/DatePickerNew',
  component: DatePickerNew,
} as ComponentMeta<typeof DatePickerNew>;

export const Basic: ComponentStory<typeof DatePickerNew> = (args) => <DatePickerNew {...args} />;

Basic.args = {};
