import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TsraLifeSuccess from './TsraLifeSuccess';

export default {
  title: 'components/TsraLifeSuccess',
  component: TsraLifeSuccess,
} as ComponentMeta<typeof TsraLifeSuccess>;

export const Basic: ComponentStory<typeof TsraLifeSuccess> = () => <TsraLifeSuccess />;

Basic.args = {};
