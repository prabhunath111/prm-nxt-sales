import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TsraApprovalSummary from './TsraApprovalSummary';

export default {
  title: 'components/TsraApprovalSummary',
  component: TsraApprovalSummary,
} as ComponentMeta<typeof TsraApprovalSummary>;

export const Basic: ComponentStory<typeof TsraApprovalSummary> = () => <TsraApprovalSummary />;

Basic.args = {};
