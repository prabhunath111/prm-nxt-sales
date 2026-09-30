import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import SelectSubscriber from './SelectSubscriber';

export default {
  title: 'components/SelectSubscriber',
  component: SelectSubscriber,
} as ComponentMeta<typeof SelectSubscriber>;

export const Basic: ComponentStory<typeof SelectSubscriber> = (args) => <SelectSubscriber {...args} />;

Basic.args = {};
