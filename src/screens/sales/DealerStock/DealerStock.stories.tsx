import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DealerStock from './DealerStock';

export default {
  title: 'components/DealerStock',
  component: DealerStock,
} as ComponentMeta<typeof DealerStock>;

export const Basic: ComponentStory<typeof DealerStock> = () => <DealerStock />;

Basic.args = {};
