import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RegistrationFormBuilder from './RegistrationFormBuilder';

export default {
  title: 'components/RegistrationFormBuilder',
  component: RegistrationFormBuilder,
} as ComponentMeta<typeof RegistrationFormBuilder>;

export const Basic: ComponentStory<typeof RegistrationFormBuilder> = (args) => <RegistrationFormBuilder {...args} />;

Basic.args = {};
