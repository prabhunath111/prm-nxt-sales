import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import InvoiceTransactions from './InvoiceTransactions';

export default {
  title: 'components/InvoiceTransactions',
  component: InvoiceTransactions,
} as ComponentMeta<typeof InvoiceTransactions>;

export const Basic: ComponentStory<typeof InvoiceTransactions> = (args) => <InvoiceTransactions {...args} />;

Basic.args = {
  data: {
    subscriberId: '3897065301',
    amount: '50',
    transactionId: 'TV2501061000190334',
  },
};
