import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TextContainer from './TextContainer';

export default {
  title: 'components/TextContainer',
  component: TextContainer,
} as ComponentMeta<typeof TextContainer>;

export const Basic: ComponentStory<typeof TextContainer> = (args) => <TextContainer {...args} />;

Basic.args = {
  dataArray: [{ key: 'subscriberId' }, { key: 'mdn' }],
  data: {
    subscriberId: '1234567890',
    mdn: '1234567890',
  },
  itemContainerStyle: { flexDirection: 'row' },
  separator: ': ',
};
