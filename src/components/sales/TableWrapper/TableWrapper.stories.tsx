import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ProviderContainer from 'wrappers/container/ProviderContainer';
import TableWrapper from './TableWrapper';

export default {
  title: 'components/TableWrapper',
  component: TableWrapper,
} as ComponentMeta<typeof TableWrapper>;

export const Basic: ComponentStory<typeof TableWrapper> = (args) => (
  <ProviderContainer>
    <TableWrapper {...args} />
  </ProviderContainer>
);

Basic.args = {
  queryName: 'GetTableByQuery',
};
