import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PackageOffersWrapper from './PackageOffersWrapper';

export default {
  title: 'components/PackageOffersWrapper',
  component: PackageOffersWrapper,
} as ComponentMeta<typeof PackageOffersWrapper>;

export const Basic: ComponentStory<typeof PackageOffersWrapper> = () => <PackageOffersWrapper />;

Basic.args = {};
