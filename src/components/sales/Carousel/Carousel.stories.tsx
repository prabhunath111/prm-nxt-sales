import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Carousel from './Carousel';

export default {
  title: 'components/Carousel',
  component: Carousel,
} as ComponentMeta<typeof Carousel>;

export const Basic: ComponentStory<typeof Carousel> = (args) => <Carousel {...args} />;

Basic.args = {
  data: [
    { id: 1, image: 'Slot1' },
    { id: 2, image: 'Slot2' },
    { id: 3, image: 'Slot3' },
    { id: 4, image: 'Slot4' },
  ],
};
