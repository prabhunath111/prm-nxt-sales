import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PartnerInfo from './PartnerInfo';

export default {
  title: 'components/PartnerInfo',
  component: PartnerInfo,
} as ComponentMeta<typeof PartnerInfo>;

export const Basic: ComponentStory<typeof PartnerInfo> = () => <PartnerInfo />;

Basic.args = {};
