import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AddPackageOffer from './AddPackageOffer';

export default {
  title: 'components/AddPackageOffer',
  component: AddPackageOffer,
} as ComponentMeta<typeof AddPackageOffer>;

export const Basic: ComponentStory<typeof AddPackageOffer> = (args) => <AddPackageOffer {...args} />;

Basic.args = {};
