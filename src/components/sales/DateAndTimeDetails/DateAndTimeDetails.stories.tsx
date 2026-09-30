import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DateAndTimeDetails from './DateAndTimeDetails';

export default {
  title: 'components/DateAndTimeDetails',
  component: DateAndTimeDetails,
} as ComponentMeta<typeof DateAndTimeDetails>;

export const Basic: ComponentStory<typeof DateAndTimeDetails> = () => <DateAndTimeDetails />;

Basic.args = {};
