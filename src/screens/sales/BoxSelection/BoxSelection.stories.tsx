import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BoxSelection from './BoxSelection';

export default {
  title: 'components/BoxSelection',
  component: BoxSelection,
} as ComponentMeta<typeof BoxSelection>;

export const Basic: ComponentStory<typeof BoxSelection> = () => <BoxSelection />;

Basic.args = {
  text: 'Sample Screen',
};
