import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TableCell from './TableCell';

export default {
  title: 'components/TableCell',
  component: TableCell,
} as ComponentMeta<typeof TableCell>;

export const Basic: ComponentStory<typeof TableCell> = (args) => <TableCell {...args} />;

Basic.args = {
  getValue: (value: any) => value,
};
