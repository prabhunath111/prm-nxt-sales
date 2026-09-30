import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import NavItem from './NavItem';

export default {
  title: 'components/NavItem',
  component: NavItem,
} as ComponentMeta<typeof NavItem>;

export const Basic: ComponentStory<typeof NavItem> = (args) => <NavItem {...args} />;

Basic.args = {
  link: '/',
  title: 'Home',
  index: 1,
  isPrimary: false,
};
