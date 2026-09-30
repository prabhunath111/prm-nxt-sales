import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';
import FormWrapper from './FormWrapper';

export default {
  title: 'components/FormWrapper',
  component: FormWrapper,
} as ComponentMeta<typeof FormWrapper>;

export const Basic: ComponentStory<typeof FormWrapper> = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <FormWrapper {...args} />
    </BrowserRouter>
  </Provider>
);

Basic.args = {
  style: {},
};
