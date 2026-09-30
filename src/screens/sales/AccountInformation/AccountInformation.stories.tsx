import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AccountInformation from './AccountInformation';

export default {
  title: 'components/AccountInformation',
  component: AccountInformation,
} as ComponentMeta<typeof AccountInformation>;

export const Basic: ComponentStory<typeof AccountInformation> = () => <AccountInformation />;

Basic.args = {};
