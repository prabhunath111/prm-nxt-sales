import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PacksListItem from './PacksListItem';

export default {
  title: 'components/PacksListItem',
  component: PacksListItem,
} as ComponentMeta<typeof PacksListItem>;

export const Basic: ComponentStory<typeof PacksListItem> = (args) => <PacksListItem {...args} />;

Basic.args = {};
