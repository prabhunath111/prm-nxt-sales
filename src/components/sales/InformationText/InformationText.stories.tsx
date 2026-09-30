import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import InformationText from './InformationText';

export default {
  title: 'components/InformationText',
  component: InformationText,
} as ComponentMeta<typeof InformationText>;

export const Basic: ComponentStory<typeof InformationText> = (args) => <InformationText {...args} />;

Basic.args = {
  containerStyle: {},
  primaryStyle: {},
  secondaryStyle: {},
  primaryText: 'transactionId',
  secondaryText: '1234567890',
  separator: ':',
};
