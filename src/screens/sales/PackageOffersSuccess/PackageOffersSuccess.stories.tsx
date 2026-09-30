import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import PackageOffersSuccess from './PackageOffersSuccess';

export default {
  title: 'components/PackageOffersSuccess',
  component: PackageOffersSuccess,
} as ComponentMeta<typeof PackageOffersSuccess>;

export const Basic: ComponentStory<typeof PackageOffersSuccess> = () => (
  <Provider store={store}>
    <PackageOffersSuccess />
  </Provider>
);

Basic.args = {
  text: 'Sample Screen',
};
