import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Faq from './Faq';

export default {
  title: 'components/Faq',
  component: Faq,
} as ComponentMeta<typeof Faq>;

export const Basic: ComponentStory<typeof Faq> = () => <Faq />;

Basic.args = {};
