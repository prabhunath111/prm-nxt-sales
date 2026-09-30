import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { FORMS } from 'const';
import { BrowserRouter } from 'react-router-dom';
import FormBuilder from './FormBuilder';

export default {
  title: 'components/FormBuilder',
  component: FormBuilder,
} as ComponentMeta<typeof FormBuilder>;

export const Basic: ComponentStory<typeof FormBuilder> = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <FormBuilder {...args} />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  formName: FORMS.customerRecharge,
  onSubmit: () => ({}),
  style: {},
};
