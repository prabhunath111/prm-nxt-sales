import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ErrorPage from './ErrorPage';

export default {
  title: 'components/ErrorPage',
  component: ErrorPage,
} as ComponentMeta<typeof ErrorPage>;

export const Basic: ComponentStory<typeof ErrorPage> = () => <ErrorPage />;
