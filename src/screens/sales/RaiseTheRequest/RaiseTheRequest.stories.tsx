import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RaiseTheRequest from './RaiseTheRequest';

export default {
  title: 'components/RaiseTheRequest',
  component: RaiseTheRequest,
} as ComponentMeta<typeof RaiseTheRequest>;

export const Basic: ComponentStory<typeof RaiseTheRequest> = () => <RaiseTheRequest />;

Basic.args = {};
