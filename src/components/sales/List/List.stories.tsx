import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Text, List } from 'components/sales';
import { Colors, Typography } from 'styles';

export default {
  title: 'components/List',
  component: List,
} as ComponentMeta<typeof List>;

export const Basic: ComponentStory<typeof List> = (args) => <List {...args} />;

Basic.args = {
  data: [
    {
      id: '0',
      title: 'First Item',
    },
    {
      id: '1',
      title: 'Second Item',
    },
    {
      id: '2',
      title: 'Third Item',
    },
  ],
  renderItem: ({ item }) => <Text label={item.title} />,
  ListHeaderComponent: <Text label="Sample List" color={Colors.primary.brand} fontSize={Typography.fontSize.x40.fontSize} />,
  horizontal: false,
};
