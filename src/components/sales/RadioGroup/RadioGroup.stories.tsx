import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { PROPERTIES, RADIO_GROUP } from 'const';
import { I18nextProvider } from 'react-i18next';
import i18n from 'config/i18n';
import RadioGroup from './RadioGroup';

export default {
  title: 'components/RadioGroup',
  component: RadioGroup,
} as ComponentMeta<typeof RadioGroup>;

export const Basic: ComponentStory<typeof RadioGroup> = (args) => (
  <I18nextProvider i18n={i18n}>
    <RadioGroup {...args} />
  </I18nextProvider>
);

Basic.args = {
  groups: [
    {
      heading: RADIO_GROUP.RechargeFlexiPlan,
      items: PROPERTIES.CUSTOMER_RECHARGE.RECHARGE_FLEXI_PLAN,
      data: {},
    },
    {
      heading: RADIO_GROUP.OtherRechargeOption,
      items: PROPERTIES.CUSTOMER_RECHARGE.OTHER_RECHARGE_OPTIONS,
      data: {},
    },
  ],
};
