import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CallSubscriberCard from './CallSubscriberCard';

export default {
  title: 'components/CallSubscriberCard',
  component: CallSubscriberCard,
} as ComponentMeta<typeof CallSubscriberCard>;

export const Basic: ComponentStory<typeof CallSubscriberCard> = () => <CallSubscriberCard />;

Basic.args = {};
