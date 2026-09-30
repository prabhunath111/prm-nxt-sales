import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CalendarNew from './CalendarNew';

export default {
  title: 'components/CalendarNew',
  component: CalendarNew,
} as ComponentMeta<typeof CalendarNew>;

export const Basic: ComponentStory<typeof CalendarNew> = (args) => <CalendarNew {...args} />;

Basic.args = {};
