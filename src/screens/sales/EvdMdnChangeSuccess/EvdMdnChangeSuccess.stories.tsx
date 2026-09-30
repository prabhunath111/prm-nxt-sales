import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EvdMdnChangeSuccess from './EvdMdnChangeSuccess';

export default {
  title: 'components/EvdMdnChangeSuccess',
  component: EvdMdnChangeSuccess,
} as ComponentMeta<typeof EvdMdnChangeSuccess>;

export const Basic: ComponentStory<typeof EvdMdnChangeSuccess> = () => <EvdMdnChangeSuccess />;

Basic.args = {};
