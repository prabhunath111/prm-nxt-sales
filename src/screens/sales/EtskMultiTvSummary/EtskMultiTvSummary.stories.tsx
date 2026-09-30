import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EtskMultiTvSummary from './EtskMultiTvSummary';

export default {
  title: 'components/EtskMultiTvSummary',
  component: EtskMultiTvSummary,
} as ComponentMeta<typeof EtskMultiTvSummary>;

export const Basic: ComponentStory<typeof EtskMultiTvSummary> = () => <EtskMultiTvSummary />;

Basic.args = {};
