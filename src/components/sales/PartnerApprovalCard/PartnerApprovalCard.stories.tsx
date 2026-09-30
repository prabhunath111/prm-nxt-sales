import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PartnerApprovalCard from './PartnerApprovalCard';

export default {
  title: 'components/PartnerApprovalCard',
  component: PartnerApprovalCard,
} as ComponentMeta<typeof PartnerApprovalCard>;

export const Basic: ComponentStory<typeof PartnerApprovalCard> = (args) => <PartnerApprovalCard {...args} />;

Basic.args = {};
