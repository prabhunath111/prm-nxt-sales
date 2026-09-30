import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import SlabList from './SlabList';

export default {
  title: 'components/SlabList',
  component: SlabList,
} as ComponentMeta<typeof SlabList>;

export const Basic: ComponentStory<typeof SlabList> = (args) => <SlabList {...args} />;

Basic.args = {};
