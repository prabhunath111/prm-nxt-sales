import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CustomFallback from './CustomFallback';

export default {
  title: 'components/CustomFallback',
  component: CustomFallback,
} as ComponentMeta<typeof CustomFallback>;

export const Basic: ComponentStory<typeof CustomFallback> = () => <CustomFallback />;

Basic.args = {};
