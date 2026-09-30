import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Redirection from './Redirection';

export default {
  title: 'components/Redirection',
  component: Redirection,
} as ComponentMeta<typeof Redirection>;

export const Basic: ComponentStory<typeof Redirection> = () => <Redirection />;

Basic.args = {};
