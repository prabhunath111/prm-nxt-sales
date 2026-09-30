import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import LiveNewsCardContainer from './LiveNewsCardContainer';

export default {
  title: 'components/LiveNewsCardContainer',
  component: LiveNewsCardContainer,
} as ComponentMeta<typeof LiveNewsCardContainer>;

export const Basic: ComponentStory<typeof LiveNewsCardContainer> = args => (
  <LiveNewsCardContainer {...args} />
);

Basic.args = {
  link: '/',
  title: 'Home'
};
