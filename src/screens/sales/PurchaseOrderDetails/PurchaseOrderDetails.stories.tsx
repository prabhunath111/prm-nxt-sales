import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PurchaseOrderDetails from './PurchaseOrderDetails';

export default {
  title: 'components/PurchaseOrderDetails',
  component: PurchaseOrderDetails,
} as ComponentMeta<typeof PurchaseOrderDetails>;

export const Basic: ComponentStory<typeof PurchaseOrderDetails> = () => <PurchaseOrderDetails />;

Basic.args = {};
