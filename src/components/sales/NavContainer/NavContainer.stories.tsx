import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import NavContainer from './NavContainer';

export default {
  title: 'components/NavContainer',
  component: NavContainer,
} as ComponentMeta<typeof NavContainer>;

export const Basic: ComponentStory<typeof NavContainer> = (args) => <NavContainer {...args} />;

Basic.args = {
  data: [],
  isPrimary: true,
};
