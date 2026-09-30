import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CustomCalendar from './CustomCalendar';

export default {
  title: 'components/CustomCalendar',
  component: CustomCalendar,
} as ComponentMeta<typeof CustomCalendar>;

export const Basic: ComponentStory<typeof CustomCalendar> = (args) => <CustomCalendar {...args} />;

Basic.args = {};
