import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Login from './Login';

export default {
  title: 'components/Login',
  component: Login,
} as ComponentMeta<typeof Login>;

export const Basic: ComponentStory<typeof Login> = () => <Login />;

Basic.args = {
  text: 'Sample Screen',
};
