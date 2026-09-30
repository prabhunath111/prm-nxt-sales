import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import QuotationPortalDetails from './QuotationPortalDetails';

export default {
  title: 'components/QuotationPortalDetails',
  component: QuotationPortalDetails,
} as ComponentMeta<typeof QuotationPortalDetails>;

export const Basic: ComponentStory<typeof QuotationPortalDetails> = () => <QuotationPortalDetails />;

Basic.args = {};
