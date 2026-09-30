import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import SelectDate from './SelectDate';

export default {
  title: 'components/SelectDate',
  component: SelectDate,
} as ComponentMeta<typeof SelectDate>;

export const Basic: ComponentStory<typeof SelectDate> = (args) => <SelectDate {...args} />;

Basic.args = {};
