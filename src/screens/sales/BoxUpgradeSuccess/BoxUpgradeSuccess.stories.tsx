import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BoxUpgradeSuccess from './BoxUpgradeSuccess';

export default {
  title: 'components/BoxUpgradeSuccess',
  component: BoxUpgradeSuccess,
} as ComponentMeta<typeof BoxUpgradeSuccess>;

export const Basic: ComponentStory<typeof BoxUpgradeSuccess> = () => <BoxUpgradeSuccess />;

Basic.args = {
  text: 'Sample Screen',
};
