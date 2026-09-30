import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ActionTileCard from './ActionTileCard';

export default {
  title: 'components/ActionTileCard',
  component: ActionTileCard,
} as ComponentMeta<typeof ActionTileCard>;

export const Basic: ComponentStory<typeof ActionTileCard> = (args) => <ActionTileCard {...args} />;

Basic.args = {};
