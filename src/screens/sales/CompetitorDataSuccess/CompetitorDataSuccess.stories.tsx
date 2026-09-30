import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CompetitorDataSuccess from './CompetitorDataSuccess';

export default {
  title: 'components/CompetitorDataSuccess',
  component: CompetitorDataSuccess,
} as ComponentMeta<typeof CompetitorDataSuccess>;

export const Basic: ComponentStory<typeof CompetitorDataSuccess> = () => <CompetitorDataSuccess />;

Basic.args = {};
