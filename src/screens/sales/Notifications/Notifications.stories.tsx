import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Notifications from './Notifications';

export default {
  title: 'components/Notifications',
  component: Notifications,
} as ComponentMeta<typeof Notifications>;

export const Basic: ComponentStory<typeof Notifications> = () => <Notifications />;

Basic.args = {};
