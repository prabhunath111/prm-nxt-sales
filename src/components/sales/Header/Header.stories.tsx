import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Header from './Header';

export default {
  title: 'components/Header',
  component: Header,
} as ComponentMeta<typeof Header>;

export const Basic: ComponentStory<typeof Header> = (args) => <Header {...args} />;

Basic.args = {};
