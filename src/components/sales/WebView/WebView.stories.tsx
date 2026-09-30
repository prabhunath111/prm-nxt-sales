import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import WebView from './WebView';

export default {
  title: 'components/WebView',
  component: WebView,
} as ComponentMeta<typeof WebView>;

export const Basic: ComponentStory<typeof WebView> = (args) => <WebView {...args} />;

Basic.args = {};
