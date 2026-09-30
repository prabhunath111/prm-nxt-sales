import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';
import SecondaryHeader from './SecondaryHeader';

export default {
  title: 'components/SecondaryHeader',
  component: SecondaryHeader,
} as ComponentMeta<typeof SecondaryHeader>;

export const Basic: ComponentStory<typeof SecondaryHeader> = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <SecondaryHeader {...args} />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  screenName: 'Home',
};
