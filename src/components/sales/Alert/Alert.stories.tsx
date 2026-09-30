import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';
import Alert from './Alert';

export default {
  title: 'components/Alert',
  component: Alert,
} as ComponentMeta<typeof Alert>;

export const Basic: ComponentStory<typeof Alert> = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <Alert {...args} />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  containerStyles: {},
  textStyles: {},
  useNativeDriver: true,
  animated: true,
};
