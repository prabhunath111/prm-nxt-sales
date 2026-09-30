import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import VideoPlayer from './VideoPlayer';

export default {
  title: 'components/VideoPlayer',
  component: VideoPlayer,
} as ComponentMeta<typeof VideoPlayer>;

export const Basic: ComponentStory<typeof VideoPlayer> = args => (
  <VideoPlayer {...args} />
);

Basic.args = {
  link: '/',
  title: 'Home'
};
