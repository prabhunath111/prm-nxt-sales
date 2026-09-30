import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import LanguageSelector from './LanguageSelector';

export default {
  title: 'components/LanguageSelector',
  component: LanguageSelector,
} as ComponentMeta<typeof LanguageSelector>;

export const Basic: ComponentStory<typeof LanguageSelector> = () => <LanguageSelector />;

Basic.args = {};
