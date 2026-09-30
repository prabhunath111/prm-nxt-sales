import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CreateChannelPartner from './CreateChannelPartner';

export default {
  title: 'components/CreateChannelPartner',
  component: CreateChannelPartner,
} as ComponentMeta<typeof CreateChannelPartner>;

export const Basic: ComponentStory<typeof CreateChannelPartner> = () => <CreateChannelPartner />;

Basic.args = {};
