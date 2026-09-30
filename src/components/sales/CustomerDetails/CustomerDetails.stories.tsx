import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from 'store';
import CustomerDetails from './CustomerDetails';

export default {
  title: 'components/CustomerDetails',
  component: CustomerDetails,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
  argTypes: {
    queryName: { control: 'text' },
    button: { control: 'boolean' },
  },
} as ComponentMeta<typeof CustomerDetails>;

const Template: ComponentStory<typeof CustomerDetails> = (args) => <CustomerDetails {...args} />;

export const WithButton = Template.bind({});
WithButton.args = {
  queryName: 'otfCustomerDetails',
  button: true,
};

export const WithoutButton = Template.bind({});
WithoutButton.args = {
  queryName: 'otfCustomerDetails',
  button: false,
};
