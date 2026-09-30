import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ProviderContainer from 'wrappers/container/ProviderContainer';
import InventoryTableWrapper from './InventoryTableWrapper';

export default {
  title: 'components/InventoryTableWrapper',
  component: InventoryTableWrapper,
} as ComponentMeta<typeof InventoryTableWrapper>;

export const Basic: ComponentStory<typeof InventoryTableWrapper> = (args) => (
  <ProviderContainer>
    <InventoryTableWrapper {...args} />
  </ProviderContainer>
);

Basic.args = {
  queryName: 'GetTableByQuery',
};
