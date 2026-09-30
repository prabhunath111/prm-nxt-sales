import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ActivationStatus from './ActivationStatus';

export default {
  title: 'components/ActivationStatus',
  component: ActivationStatus,
} as ComponentMeta<typeof ActivationStatus>;

export const Basic: ComponentStory<typeof ActivationStatus> = () => <ActivationStatus />;
