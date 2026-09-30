import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DemoForm from './DemoForm';

export default {
  title: 'components/DemoForm',
  component: DemoForm,
} as ComponentMeta<typeof DemoForm>;

export const Basic: ComponentStory<typeof DemoForm> = () => <DemoForm />;

Basic.args = {};
