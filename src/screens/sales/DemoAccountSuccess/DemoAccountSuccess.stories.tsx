import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DemoAccountSuccess from './DemoAccountSuccess';

export default {
  title: 'components/DemoAccountSuccess',
  component: DemoAccountSuccess,
} as ComponentMeta<typeof DemoAccountSuccess>;

export const Basic: ComponentStory<typeof DemoAccountSuccess> = () => <DemoAccountSuccess />;

Basic.args = {};
