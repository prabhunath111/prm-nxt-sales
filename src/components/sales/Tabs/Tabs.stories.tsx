import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { View } from 'react-native';
import Text from 'components/sales/Text';
import Tabs from './Tabs';

export default {
  title: 'components/Tabs',
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

export const Basic: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />;

Basic.args = {
  tabs: [
    {
      key: 'home',
      title: 'Home',
      component: (
        <View>
          <Text>Home Screen</Text>
        </View>
      ),
    },
    {
      key: 'settings',
      title: 'Settings',
      component: (
        <View>
          <Text>Settings Screen</Text>
        </View>
      ),
    },
    {
      key: 'profile',
      title: 'Profile',
      component: (
        <View>
          <Text>Profile Screen</Text>
        </View>
      ),
    },
  ],
  isPortrait: false,
};
