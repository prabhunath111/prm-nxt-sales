import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import QuotationPrimaryOffer from './QuotationPrimaryOffer';

export default {
  title: 'components/QuotationPrimaryOffer',
  component: QuotationPrimaryOffer,
} as ComponentMeta<typeof QuotationPrimaryOffer>;

export const Basic: ComponentStory<typeof QuotationPrimaryOffer> = () => <QuotationPrimaryOffer />;

Basic.args = {};
