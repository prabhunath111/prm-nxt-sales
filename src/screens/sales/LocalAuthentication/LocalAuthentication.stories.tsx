import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import LocalAuthentication from './LocalAuthentication';

export default {
  title: 'components/LocalAuthentication',
  component: LocalAuthentication,
} as ComponentMeta<typeof LocalAuthentication>;

export const Basic: ComponentStory<typeof LocalAuthentication> = () => <LocalAuthentication />;

Basic.args = {
  text: 'Sample Screen',
};
