import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EtskRegistration from './EtskRegistration';

export default {
  title: 'components/EtskRegistration',
  component: EtskRegistration,
} as ComponentMeta<typeof EtskRegistration>;

export const Basic: ComponentStory<typeof EtskRegistration> = () => <EtskRegistration />;

Basic.args = {};
