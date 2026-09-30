import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import IconWithCount from './IconWithCount';

export default {
  title: 'components/IconWithCount',
  component: IconWithCount,
} as ComponentMeta<typeof IconWithCount>;

export const Basic: ComponentStory<typeof IconWithCount> = (args) => <IconWithCount {...args} />;

Basic.args = {};
