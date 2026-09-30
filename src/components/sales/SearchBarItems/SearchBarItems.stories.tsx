import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';
import { SEARCH_LIST } from 'const';
import SearchBarItems from './SearchBarItems';

export default {
  title: 'components/SearchBarItems',
  component: SearchBarItems,
} as ComponentMeta<typeof SearchBarItems>;

export const Basic: ComponentStory<typeof SearchBarItems> = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <SearchBarItems {...args} />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  listType: SEARCH_LIST.AUTO_EVD_DEALERS,
  itemsArr: [
    {
      dealerName: 'Test Dealer',
      evdCode: '12345',
      mdn: '1234567890',
      thresholdSet: 'No',
      thresholdLimitValue: '',
      autoEvdAmount: '',
    },
  ],
};
