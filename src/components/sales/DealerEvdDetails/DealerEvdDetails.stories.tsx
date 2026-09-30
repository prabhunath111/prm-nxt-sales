import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DealerEvdDetails from './DealerEvdDetails';

export default {
  title: 'components/DealerEvdDetails',
  component: DealerEvdDetails,
} as ComponentMeta<typeof DealerEvdDetails>;

export const Basic: ComponentStory<typeof DealerEvdDetails> = (args) => <DealerEvdDetails {...args} />;

Basic.args = {
  data: {
    name: 'Kunal',
    mdn: '3897065301',
    outletType: 'Kirana store',
    presentBalance: '10,000',
    avgDailyRecharge: '50',
    thresholdSet: 'Yes',
    evdCode: '12345',
  },
  onButtonPress: () => {},
};
