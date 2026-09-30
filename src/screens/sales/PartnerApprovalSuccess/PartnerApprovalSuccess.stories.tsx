import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PartnerApprovalSuccess from './PartnerApprovalSuccess';

export default {
  title: 'components/PartnerApprovalSuccess',
  component: PartnerApprovalSuccess,
} as ComponentMeta<typeof PartnerApprovalSuccess>;

export const Basic: ComponentStory<typeof PartnerApprovalSuccess> = () => <PartnerApprovalSuccess />;

Basic.args = {};
