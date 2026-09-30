import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Sales from './Sales';

export default {
  title: 'components/Sales',
  component: Sales,
} as ComponentMeta<typeof Sales>;

export const Basic: ComponentStory<typeof Sales> = () => <Sales />;

Basic.args = {};
