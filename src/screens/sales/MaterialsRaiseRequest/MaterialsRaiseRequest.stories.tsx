import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MaterialsRaiseRequest from './MaterialsRaiseRequest';

export default {
  title: 'components/MaterialsRaiseRequest',
  component: MaterialsRaiseRequest,
} as ComponentMeta<typeof MaterialsRaiseRequest>;

export const Basic: ComponentStory<typeof MaterialsRaiseRequest> = () => <MaterialsRaiseRequest />;

Basic.args = {};
