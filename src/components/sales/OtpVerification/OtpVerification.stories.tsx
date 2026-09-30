import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import OtpVerification from './OtpVerification';

export default {
  title: 'components/OtpVerification',
  component: OtpVerification,
} as ComponentMeta<typeof OtpVerification>;

export const Basic: ComponentStory<typeof OtpVerification> = (args) => <OtpVerification {...args} />;

Basic.args = {
  mobile: 'Home',
};
