import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import EvdMdnDistSuccess from './EvdMdnDistSuccess';

export default {
  title: 'components/EvdMdnDistSuccess',
  component: EvdMdnDistSuccess,
} as ComponentMeta<typeof EvdMdnDistSuccess>;

export const Basic: ComponentStory<typeof EvdMdnDistSuccess> = () => <EvdMdnDistSuccess />;

Basic.args = {
  text: 'Sample Screen',
};
