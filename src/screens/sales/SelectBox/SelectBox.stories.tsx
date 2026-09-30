import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import SelectBox from './SelectBox';

export default {
  title: 'components/SelectBox',
  component: SelectBox,
} as ComponentMeta<typeof SelectBox>;

export const Basic: ComponentStory<typeof SelectBox> = () => <SelectBox />;

Basic.args = {
  text: 'Sample Screen',
};
