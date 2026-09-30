import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AutoEvdSuccess from './AutoEvdSuccess';

export default {
  title: 'components/AutoEvdSuccess',
  component: AutoEvdSuccess,
} as ComponentMeta<typeof AutoEvdSuccess>;

export const Basic: ComponentStory<typeof AutoEvdSuccess> = () => <AutoEvdSuccess />;

Basic.args = {
  text: 'Sample Screen',
};
