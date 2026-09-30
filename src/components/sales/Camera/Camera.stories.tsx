import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Camera from './Camera';

export default {
  title: 'components/Camera',
  component: Camera,
} as ComponentMeta<typeof Camera>;

export const Basic: ComponentStory<typeof Camera> = (args) => <Camera {...args} />;

Basic.args = {
  onScan: () => {},
  isScanner: false,
};
