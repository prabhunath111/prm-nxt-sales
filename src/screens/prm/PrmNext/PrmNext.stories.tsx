import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store';
import PrmNext from './PrmNext';

export default {
  title: 'components/PrmNext',
  component: PrmNext,
} as ComponentMeta<typeof PrmNext>;

export const Basic: ComponentStory<typeof PrmNext> = () => (
  <Provider store={store}>
    <BrowserRouter>
      <PrmNext />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  customFormName: 'Sample Screen',
};
