import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import AppLoader from './AppLoader';

export default {
  title: 'components/AppLoader',
  component: AppLoader,
} as ComponentMeta<typeof AppLoader>;

export const Basic: ComponentStory<typeof AppLoader> = (args) => (
  <Provider store={store}>
    <AppLoader {...args} />{' '}
  </Provider>
);

Basic.args = {
  message: 'Loading...',
};
