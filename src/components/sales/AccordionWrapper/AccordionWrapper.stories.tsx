import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { store } from 'store';
import AccordionWrapper from './AccordionWrapper';

export default {
  title: 'components/AccordionWrapper',
  component: AccordionWrapper,
} as ComponentMeta<typeof AccordionWrapper>;

export const Basic: ComponentStory<typeof AccordionWrapper> = (args) => (
  <Provider store={store}>
    <AccordionWrapper {...args} />
  </Provider>
);

Basic.args = {
  name: 'Home',
};
