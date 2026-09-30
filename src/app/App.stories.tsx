import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import App from './App';

export default {
  title: 'app/App',
  component: App,
} as ComponentMeta<typeof App>;

export const Basic: ComponentStory<typeof App> = () => <App />;

Basic.args = {};
