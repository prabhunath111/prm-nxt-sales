import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import HomePage from './HomePage';

export default {
  title: 'components/HomePage',
  component: HomePage,
} as ComponentMeta<typeof HomePage>;

export const Basic: ComponentStory<typeof HomePage> = () => <HomePage />;
