import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ActionPartnerRequest from './ActionPartnerRequest';

export default {
  title: 'components/ActionPartnerRequest',
  component: ActionPartnerRequest,
} as ComponentMeta<typeof ActionPartnerRequest>;

export const Basic: ComponentStory<typeof ActionPartnerRequest> = () => <ActionPartnerRequest />;

Basic.args = {
  text: 'Sample Screen',
};
