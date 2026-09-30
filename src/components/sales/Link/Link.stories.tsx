import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Link from './Link';

export default {
  title: 'components/Link',
  component: Link,
} as ComponentMeta<typeof Link>;

export const Basic: ComponentStory<typeof Link> = (args) => <Link {...args} />;

Basic.args = {
  label: 'Home',
};
