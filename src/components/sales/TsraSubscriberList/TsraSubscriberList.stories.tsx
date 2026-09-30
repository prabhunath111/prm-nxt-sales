import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TsraSubscriberList from './TsraSubscriberList';

export default {
  title: 'components/TsraSubscriberList',
  component: TsraSubscriberList,
} as ComponentMeta<typeof TsraSubscriberList>;

export const Basic: ComponentStory<typeof TsraSubscriberList> = () => <TsraSubscriberList />;

Basic.args = {};
