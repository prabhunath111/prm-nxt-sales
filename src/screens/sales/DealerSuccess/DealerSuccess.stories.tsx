import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DealerSuccess from './DealerSuccess';

export default {
  title: 'components/DealerSuccess',
  component: DealerSuccess,
} as ComponentMeta<typeof DealerSuccess>;

export const Basic: ComponentStory<typeof DealerSuccess> = () => <DealerSuccess />;

Basic.args = {
  text: 'Sample Screen',
};
