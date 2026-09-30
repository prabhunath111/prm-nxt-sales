import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';
import DealerDetailsCard from './DealerDetailsCard';

export default {
  title: 'components/DealerDetailsCard',
  component: DealerDetailsCard,
} as ComponentMeta<typeof DealerDetailsCard>;

export const Basic: ComponentStory<typeof DealerDetailsCard> = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <DealerDetailsCard {...args} />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  routeName: '/',
  mdn: '1234567890',
  evdCode: 'ABCDE',
  name: 'John Doe',
};
