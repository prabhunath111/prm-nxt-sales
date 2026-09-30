import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ExclusiveStoreQuestion from './ExclusiveStoreQuestion';

export default {
  title: 'components/ExclusiveStoreQuestion',
  component: ExclusiveStoreQuestion,
} as ComponentMeta<typeof ExclusiveStoreQuestion>;

export const Basic: ComponentStory<typeof ExclusiveStoreQuestion> = () => <ExclusiveStoreQuestion />;

Basic.args = {};
