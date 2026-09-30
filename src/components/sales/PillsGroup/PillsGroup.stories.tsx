import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import PillsGroup from './PillsGroup';

export default {
  title: 'components/PillsGroup',
  component: PillsGroup,
} as ComponentMeta<typeof PillsGroup>;

export const Basic: ComponentStory<typeof PillsGroup> = (args) => <PillsGroup {...args} />;

Basic.args = {
  itemsArr: ['500', '1000', '2000'],
  onPillPress: () => {},
};
