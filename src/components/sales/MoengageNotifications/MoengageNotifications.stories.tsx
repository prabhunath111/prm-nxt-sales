import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MoengageNotifications from './MoengageNotifications';

export default {
  title: 'components/MoengageNotifications',
  component: MoengageNotifications,
} as ComponentMeta<typeof MoengageNotifications>;

export const Basic: ComponentStory<typeof MoengageNotifications> = () => <MoengageNotifications />;

Basic.args = {};
