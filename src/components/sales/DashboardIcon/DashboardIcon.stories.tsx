import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ProviderContainer from 'wrappers/container/ProviderContainer';
import DashboardIcon from './DashboardIcon';

export default {
  title: 'components/DashboardIcon',
  component: DashboardIcon,
} as ComponentMeta<typeof DashboardIcon>;

export const Basic: ComponentStory<typeof DashboardIcon> = (args) => (
  <ProviderContainer>
    <DashboardIcon {...args} />
  </ProviderContainer>
);

Basic.args = {
  label: 'Modify Pack',
  value: 'http://google.com',
};
