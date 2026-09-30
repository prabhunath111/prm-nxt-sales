import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AutoPostWebView from './AutoPostWebView';

export default {
  title: 'components/AutoPostWebView',
  component: AutoPostWebView,
} as ComponentMeta<typeof AutoPostWebView>;

export const Basic: ComponentStory<typeof AutoPostWebView> = () => <AutoPostWebView />;

Basic.args = {};
