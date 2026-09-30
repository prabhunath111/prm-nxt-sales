import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PurchaseOrderHome from './PurchaseOrderHome';

export default {
  title: 'components/PurchaseOrderHome',
  component: PurchaseOrderHome,
} as ComponentMeta<typeof PurchaseOrderHome>;

export const Basic: ComponentStory<typeof PurchaseOrderHome> = () => <PurchaseOrderHome />;

Basic.args = {};
