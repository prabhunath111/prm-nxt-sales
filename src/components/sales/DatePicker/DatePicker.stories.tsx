import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Colors, Sizing } from 'styles';
import DatePicker from './DatePicker';

export default {
  title: 'components/DatePicker',
  component: DatePicker,
} as ComponentMeta<typeof DatePicker>;

export const Basic: ComponentStory<typeof DatePicker> = (args) => <DatePicker {...args} />;

Basic.args = {
  disabled: false,
  onDateSelected: () => {
    // LOG.info('day - ', day);
  },
  imgStyle: {},
  inputStyle: {
    height: Sizing.x40,
    borderRadius: Sizing.x5,
    borderWidth: Sizing.x1,
    borderColor: Colors.neutral.black,
    color: Colors.neutral.black,
    paddingLeft: Sizing.x10,
  },
  defaultDate: new Date().toISOString().substring(0, 10),
};
