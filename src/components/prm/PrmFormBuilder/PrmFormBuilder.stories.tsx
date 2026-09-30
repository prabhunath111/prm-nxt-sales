import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FORMS } from 'const';
import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';
import PrmFormBuilder from './PrmFormBuilder';

export default {
  title: 'components/PrmFormBuilder',
  component: PrmFormBuilder,
} as ComponentMeta<typeof PrmFormBuilder>;

export const Basic: ComponentStory<typeof PrmFormBuilder> = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <PrmFormBuilder {...args} />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  formName: FORMS.customerRecharge,
  onSubmit: () => ({}),
};
