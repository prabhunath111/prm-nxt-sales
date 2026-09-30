import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DealerTrackRequest from './DealerTrackRequest';

export default {
  title: 'components/DealerTrackRequest',
  component: DealerTrackRequest,
} as ComponentMeta<typeof DealerTrackRequest>;

export const Basic: ComponentStory<typeof DealerTrackRequest> = () => <DealerTrackRequest />;

Basic.args = {
  text: 'Sample Screen',
};
