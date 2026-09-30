import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import WoInformation from './WoInformation';

export default {
  title: 'components/WoInformation',
  component: WoInformation,
} as ComponentMeta<typeof WoInformation>;

export const Basic: ComponentStory<typeof WoInformation> = () => <WoInformation />;
