import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import GroupedActionTiles from './GroupedActionTiles';

export default {
  title: 'components/GroupedActionTiles',
  component: GroupedActionTiles,
} as ComponentMeta<typeof GroupedActionTiles>;

export const Basic: ComponentStory<typeof GroupedActionTiles> = (args) => <GroupedActionTiles {...args} />;

Basic.args = {
  title: 'Home',
};
