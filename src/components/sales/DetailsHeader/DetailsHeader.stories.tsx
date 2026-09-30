import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DetailsHeader from './DetailsHeader';

export default {
  title: 'components/DetailsHeader',
  component: DetailsHeader,
} as ComponentMeta<typeof DetailsHeader>;

export const Basic: ComponentStory<typeof DetailsHeader> = () => <DetailsHeader />;

Basic.args = {};
