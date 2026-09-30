import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PincodeDetailsCard from './PincodeDetailsCard';

export default {
  title: 'components/PincodeDetailsCard',
  component: PincodeDetailsCard,
} as ComponentMeta<typeof PincodeDetailsCard>;

export const Basic: ComponentStory<typeof PincodeDetailsCard> = (args) => <PincodeDetailsCard {...args} />;

Basic.args = {};
