import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ActionTsraRequest from './ActionTsraRequest';

export default {
  title: 'components/ActionTsraRequest',
  component: ActionTsraRequest,
} as ComponentMeta<typeof ActionTsraRequest>;

export const Basic: ComponentStory<typeof ActionTsraRequest> = () => <ActionTsraRequest />;

Basic.args = {};
