import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Calendar from './Calendar';

export default {
  title: 'components/Calendar',
  component: Calendar,
} as ComponentMeta<typeof Calendar>;

export const Basic: ComponentStory<typeof Calendar> = (args) => <Calendar {...args} />;

Basic.args = {
  defaultDate: new Date().toISOString().substring(0, 10),
  onDateSelected: () => {},
};
