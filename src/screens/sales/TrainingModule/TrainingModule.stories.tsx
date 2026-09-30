import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TrainingModule from './TrainingModule';

export default {
  title: 'components/TrainingModule',
  component: TrainingModule,
} as ComponentMeta<typeof TrainingModule>;

export const Basic: ComponentStory<typeof TrainingModule> = () => <TrainingModule />;

Basic.args = {};
