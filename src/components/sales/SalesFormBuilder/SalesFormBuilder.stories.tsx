import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FORMS } from 'const';
import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';
import SalesFormBuilder from './SalesFormBuilder';

export default {
  title: 'components/SalesFormBuilder',
  component: SalesFormBuilder,
} as ComponentMeta<typeof SalesFormBuilder>;

export const Basic: ComponentStory<typeof SalesFormBuilder> = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <SalesFormBuilder {...args} />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  formName: FORMS.customerRecharge,
  onSubmit: () => ({}),
};
