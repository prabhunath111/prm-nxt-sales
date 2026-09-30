import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DealerRaiseRequest from './DealerRaiseRequest';

export default {
  title: 'components/DealerRaiseRequest',
  component: DealerRaiseRequest,
} as ComponentMeta<typeof DealerRaiseRequest>;

export const Basic: ComponentStory<typeof DealerRaiseRequest> = () => <DealerRaiseRequest />;

Basic.args = {
  text: 'Sample Screen',
};
