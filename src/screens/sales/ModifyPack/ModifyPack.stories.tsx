import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ModifyPack from './ModifyPack';

export default {
  title: 'components/ModifyPack',
  component: ModifyPack,
} as ComponentMeta<typeof ModifyPack>;

export const Basic: ComponentStory<typeof ModifyPack> = () => <ModifyPack />;

Basic.args = {
  text: 'Sample Screen',
};
