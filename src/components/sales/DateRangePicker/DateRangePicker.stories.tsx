import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DateRangePicker from './DateRangePicker';

export default {
  title: 'components/DateRangePicker',
  component: DateRangePicker,
} as ComponentMeta<typeof DateRangePicker>;

export const Basic: ComponentStory<typeof DateRangePicker> = (args) => <DateRangePicker {...args} />;

Basic.args = {
  placeholder: '',
};
