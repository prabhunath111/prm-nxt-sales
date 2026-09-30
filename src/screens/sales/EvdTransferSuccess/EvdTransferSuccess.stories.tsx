import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EvdTransferSuccess from './EvdTransferSuccess';

export default {
  title: 'components/EvdTransferSuccess',
  component: EvdTransferSuccess,
} as ComponentMeta<typeof EvdTransferSuccess>;

export const Basic: ComponentStory<typeof EvdTransferSuccess> = () => <EvdTransferSuccess />;

Basic.args = {
  text: 'Sample Screen',
};
