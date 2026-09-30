import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EtskRegistrationSummary from './EtskRegistrationSummary';

export default {
  title: 'components/EtskRegistrationSummary',
  component: EtskRegistrationSummary,
} as ComponentMeta<typeof EtskRegistrationSummary>;

export const Basic: ComponentStory<typeof EtskRegistrationSummary> = () => <EtskRegistrationSummary />;

Basic.args = {};
