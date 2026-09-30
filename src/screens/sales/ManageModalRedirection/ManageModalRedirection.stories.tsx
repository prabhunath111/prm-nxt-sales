import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ManageModalRedirection from './ManageModalRedirection';

export default {
  title: 'components/ManageModalRedirection',
  component: ManageModalRedirection,
} as ComponentMeta<typeof ManageModalRedirection>;

export const Basic: ComponentStory<typeof ManageModalRedirection> = (args) => <ManageModalRedirection {...args} />;

Basic.args = {
  text: 'Sample Screen',
};
