import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import BoxInfoTab from './BoxInfoTab';

export default {
  title: 'components/BoxInfoTab',
  component: BoxInfoTab,
} as ComponentMeta<typeof BoxInfoTab>;

export const Basic: ComponentStory<typeof BoxInfoTab> = (args) => <BoxInfoTab {...args} />;
Basic.args = {
  boxPrice: { old: 0, new: '1000' },
  tsk: '12',
  ncf: '10',
  packs: [],
  isPrimary: true,
  setIsPackChanged: (_val: boolean) => {},
};
