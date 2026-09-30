import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MyActions from './MyActions';

export default {
  title: 'components/MyActions',
  component: MyActions,
} as ComponentMeta<typeof MyActions>;

export const Basic: ComponentStory<typeof MyActions> = () => <MyActions />;

Basic.args = {};
