import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import BottomModal from './BottomModal';

export default {
  title: 'components/BottomModal',
  component: BottomModal,
} as ComponentMeta<typeof BottomModal>;

export const Basic: ComponentStory<typeof BottomModal> = () => (
  <Provider store={store}>
    <BottomModal />
  </Provider>
);

Basic.args = {};
