import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MyEvdBalance from './MyEvdBalance';

export default {
  title: 'components/MyEvdBalance',
  component: MyEvdBalance,
} as ComponentMeta<typeof MyEvdBalance>;

export const Basic: ComponentStory<typeof MyEvdBalance> = () => <MyEvdBalance />;

Basic.args = {};
