import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PartnerApprovalDetails from './PartnerApprovalDetails';

export default {
  title: 'components/PartnerApprovalDetails',
  component: PartnerApprovalDetails,
} as ComponentMeta<typeof PartnerApprovalDetails>;

export const Basic: ComponentStory<typeof PartnerApprovalDetails> = () => <PartnerApprovalDetails />;

Basic.args = {};
