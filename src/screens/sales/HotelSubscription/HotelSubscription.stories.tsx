import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import HotelSubscription from './HotelSubscription';

export default {
  title: 'components/HotelSubscription',
  component: HotelSubscription,
} as ComponentMeta<typeof HotelSubscription>;

export const Basic: ComponentStory<typeof HotelSubscription> = () => <HotelSubscription />;

Basic.args = {};
