import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import BalanceContainer from './BalanceContainer';

export default {
  title: 'components/BalanceContainer',
  component: BalanceContainer,
} as ComponentMeta<typeof BalanceContainer>;

export const Basic: ComponentStory<typeof BalanceContainer> = (args) => (
  <Provider store={store}>
    <BalanceContainer {...args} />
  </Provider>
);

Basic.args = {
  balance: '1,20,000',
};
