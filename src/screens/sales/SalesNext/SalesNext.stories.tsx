import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store';
import SalesNext from './SalesNext';

export default {
  title: 'components/SalesNext',
  component: SalesNext,
} as ComponentMeta<typeof SalesNext>;

export const Basic: ComponentStory<typeof SalesNext> = () => (
  <Provider store={store}>
    <BrowserRouter>
      <SalesNext />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  customFormName: 'Sample Screen',
};
