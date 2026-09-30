import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import FosDealerBalance from './FosDealerBalance';

export default {
  title: 'components/FosDealerBalance',
  component: FosDealerBalance,
} as ComponentMeta<typeof FosDealerBalance>;

export const Basic: ComponentStory<typeof FosDealerBalance> = () => <FosDealerBalance />;

Basic.args = {};
