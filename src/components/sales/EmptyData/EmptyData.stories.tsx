import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EmptyData from './EmptyData';

export default {
  title: 'components/EmptyData',
  component: EmptyData,
} as ComponentMeta<typeof EmptyData>;

export const Basic: ComponentStory<typeof EmptyData> = (args) => <EmptyData {...args} />;

Basic.args = {
  text: 'cantViewPackChangesYet',
};
