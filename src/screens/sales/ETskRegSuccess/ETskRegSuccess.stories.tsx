import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ETskRegSuccess from './ETskRegSuccess';

export default {
  title: 'components/ETskRegSuccess',
  component: ETskRegSuccess,
} as ComponentMeta<typeof ETskRegSuccess>;

export const Basic: ComponentStory<typeof ETskRegSuccess> = () => <ETskRegSuccess />;

Basic.args = {
  text: 'Sample Screen',
};
