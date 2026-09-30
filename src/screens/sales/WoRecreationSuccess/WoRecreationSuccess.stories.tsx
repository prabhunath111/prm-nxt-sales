import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import WoRecreationSuccess from './WoRecreationSuccess';

export default {
  title: 'components/WoRecreationSuccess',
  component: WoRecreationSuccess,
} as ComponentMeta<typeof WoRecreationSuccess>;

export const Basic: ComponentStory<typeof WoRecreationSuccess> = () => <WoRecreationSuccess />;

Basic.args = {};
