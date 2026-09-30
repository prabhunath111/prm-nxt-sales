import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DynamicTable from './DynamicTable';

export default {
  title: 'components/DynamicTable',
  component: DynamicTable,
} as ComponentMeta<typeof DynamicTable>;

export const Basic: ComponentStory<typeof DynamicTable> = (args) => <DynamicTable {...args} />;

Basic.args = {};
