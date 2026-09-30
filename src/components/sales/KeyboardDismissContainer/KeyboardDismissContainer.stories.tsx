import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import KeyboardDismissContainer from './KeyboardDismissContainer';

export default {
  title: 'components/KeyboardDismissContainer',
  component: KeyboardDismissContainer,
} as ComponentMeta<typeof KeyboardDismissContainer>;

export const Basic: ComponentStory<typeof KeyboardDismissContainer> = (args) => <KeyboardDismissContainer {...args} />;

Basic.args = {
  children: '',
  style: {},
};
