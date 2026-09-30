import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TsraApprovalSuccess from './TsraApprovalSuccess';

export default {
  title: 'components/TsraApprovalSuccess',
  component: TsraApprovalSuccess,
} as ComponentMeta<typeof TsraApprovalSuccess>;

export const Basic: ComponentStory<typeof TsraApprovalSuccess> = () => <TsraApprovalSuccess />;

Basic.args = {};
