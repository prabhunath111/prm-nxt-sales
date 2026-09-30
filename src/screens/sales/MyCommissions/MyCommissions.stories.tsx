import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MyCommissions from './MyCommissions';

export default {
  title: 'components/MyCommissions',
  component: MyCommissions,
} as ComponentMeta<typeof MyCommissions>;

export const Basic: ComponentStory<typeof MyCommissions> = () => <MyCommissions />;

Basic.args = {};
