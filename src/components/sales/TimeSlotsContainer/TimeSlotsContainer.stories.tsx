import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TimeSlotsContainer from './TimeSlotsContainer';

export default {
  title: 'components/TimeSlotsContainer',
  component: TimeSlotsContainer,
} as ComponentMeta<typeof TimeSlotsContainer>;

export const Basic: ComponentStory<typeof TimeSlotsContainer> = (args) => <TimeSlotsContainer {...args} />;

Basic.args = {};
