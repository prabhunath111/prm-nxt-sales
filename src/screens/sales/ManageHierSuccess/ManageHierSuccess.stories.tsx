import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ManageHierSuccess from './ManageHierSuccess';

export default {
  title: 'components/ManageHierSuccess',
  component: ManageHierSuccess,
} as ComponentMeta<typeof ManageHierSuccess>;

export const Basic: ComponentStory<typeof ManageHierSuccess> = () => <ManageHierSuccess />;

Basic.args = {
  text: 'Sample Screen',
};
