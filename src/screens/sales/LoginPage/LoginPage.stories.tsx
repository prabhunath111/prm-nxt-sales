import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import InflectionProvider from 'wrappers/inflection/InflectionProvider';

import LoginPage from './LoginPage';

export default {
  title: 'components/LoginPage',
  component: LoginPage,
} as ComponentMeta<typeof LoginPage>;

export const Basic: ComponentStory<typeof LoginPage> = () => (
  <InflectionProvider>
    <LoginPage />
  </InflectionProvider>
);
