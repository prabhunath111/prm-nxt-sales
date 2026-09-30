import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PackageInfo from './PackageInfo';

export default {
  title: 'components/PackageInfo',
  component: PackageInfo,
} as ComponentMeta<typeof PackageInfo>;

export const Basic: ComponentStory<typeof PackageInfo> = () => <PackageInfo />;
