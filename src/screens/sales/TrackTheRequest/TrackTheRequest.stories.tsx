import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TrackTheRequest from './TrackTheRequest';

export default {
  title: 'components/TrackTheRequest',
  component: TrackTheRequest,
} as ComponentMeta<typeof TrackTheRequest>;

export const Basic: ComponentStory<typeof TrackTheRequest> = () => <TrackTheRequest />;

Basic.args = {};
