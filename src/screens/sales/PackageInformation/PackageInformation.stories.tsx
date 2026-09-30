import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PackageInformation from './PackageInformation';

export default {
  title: 'components/PackageInformation',
  component: PackageInformation,
} as ComponentMeta<typeof PackageInformation>;

export const Basic: ComponentStory<typeof PackageInformation> = () => <PackageInformation />;

Basic.args = {};
