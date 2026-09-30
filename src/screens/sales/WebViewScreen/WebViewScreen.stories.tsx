import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import WebViewScreen from './WebViewScreen';

export default {
  title: 'components/WebViewScreen',
  component: WebViewScreen,
} as ComponentMeta<typeof WebViewScreen>;

export const Basic: ComponentStory<typeof WebViewScreen> = () => <WebViewScreen />;

Basic.args = {};
