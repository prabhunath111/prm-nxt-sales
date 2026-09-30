import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ICONS } from 'const';
import { Sizing } from 'styles';
import Image from './Image';

export default {
  title: 'components/Image',
  component: Image,
} as ComponentMeta<typeof Image>;

export const Basic: ComponentStory<typeof Image> = (args) => <Image {...args} />;

Basic.args = {
  isLocal: true,
  iconName: ICONS.SETTINGS,
  style: {},
  height: Sizing.layout.x5,
  width: Sizing.layout.x5,
  borderRadius: Sizing.layout.x10,
};
