import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PurchaseOrderSettlements from './PurchaseOrderSettlements';

export default {
  title: 'components/PurchaseOrderSettlements',
  component: PurchaseOrderSettlements,
} as ComponentMeta<typeof PurchaseOrderSettlements>;

export const Basic: ComponentStory<typeof PurchaseOrderSettlements> = () => <PurchaseOrderSettlements />;

Basic.args = {};
