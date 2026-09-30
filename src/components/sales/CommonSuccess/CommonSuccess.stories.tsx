import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CommonSuccess from './CommonSuccess';

export default {
  title: 'components/CommonSuccess',
  component: CommonSuccess,
} as ComponentMeta<typeof CommonSuccess>;

export const Basic: ComponentStory<typeof CommonSuccess> = (args) => <CommonSuccess {...args} />;

Basic.args = {
  primaryText: 'autoEvdSuccess',
  secondaryText: 'transactionId',
  value: '1234567890',
};
