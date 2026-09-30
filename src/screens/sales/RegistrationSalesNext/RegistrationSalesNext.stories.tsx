import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RegistrationSalesNext from './RegistrationSalesNext';

export default {
  title: 'components/RegistrationSalesNext',
  component: RegistrationSalesNext,
} as ComponentMeta<typeof RegistrationSalesNext>;

export const Basic: ComponentStory<typeof RegistrationSalesNext> = (args) => <RegistrationSalesNext {...args} />;

Basic.args = {};
