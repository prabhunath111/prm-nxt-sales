import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ChecklistTiles from './ChecklistTiles';

export default {
  title: 'components/ChecklistTiles',
  component: ChecklistTiles,
} as ComponentMeta<typeof ChecklistTiles>;

export const Basic: ComponentStory<typeof ChecklistTiles> = () => <ChecklistTiles />;

Basic.args = {};
