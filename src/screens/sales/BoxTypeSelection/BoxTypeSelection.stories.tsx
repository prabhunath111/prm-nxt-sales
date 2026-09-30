import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BoxTypeSelection from './BoxTypeSelection';

export default {
  title: 'components/BoxTypeSelection',
  component: BoxTypeSelection,
} as ComponentMeta<typeof BoxTypeSelection>;

export const Basic: ComponentStory<typeof BoxTypeSelection> = () => <BoxTypeSelection />;

Basic.args = {};
