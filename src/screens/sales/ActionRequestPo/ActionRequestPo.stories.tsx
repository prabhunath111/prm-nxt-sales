import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ActionRequestPo from './ActionRequestPo';

export default {
  title: 'components/ActionRequestPo',
  component: ActionRequestPo,
} as ComponentMeta<typeof ActionRequestPo>;

export const Basic: ComponentStory<typeof ActionRequestPo> = () => <ActionRequestPo />;

Basic.args = {};
