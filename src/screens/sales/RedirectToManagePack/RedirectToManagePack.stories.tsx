import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RedirectToManagePack from './RedirectToManagePack';

export default {
  title: 'components/RedirectToManagePack',
  component: RedirectToManagePack,
} as ComponentMeta<typeof RedirectToManagePack>;

export const Basic: ComponentStory<typeof RedirectToManagePack> = () => <RedirectToManagePack />;

Basic.args = {};
