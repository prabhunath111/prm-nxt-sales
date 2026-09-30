import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Footer from './Footer';

export default {
  title: 'components/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;

export const Basic: ComponentStory<typeof Footer> = () => <Footer />;

Basic.args = {};
