import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { View } from 'react-native';
import Text from 'components/sales/Text';
import Accordion from 'components/sales/Accordion';
import styles from './Accordion.styles';

export default {
  title: 'components/Accordion',
  component: Accordion,
} as ComponentMeta<typeof Accordion>;

export const Basic: ComponentStory<typeof Accordion> = (args) => <Accordion {...args} />;

const body = (
  <View>
    <Text style={styles.sectionTitle} label="MONTHLY ADD ON PACKAGES" />
    <Text style={styles.sectionDescription} label="Tamil 1 Month Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Telugu 1 Month Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Malayalam 1 Month Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Kannada 1 Month Free Regional Pack" />
    <Text style={styles.sectionTitle} label="ANNUALLY ADD ON PACKAGES" />
    <Text style={styles.sectionDescription} label="Tamil 1 Year Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Telugu 1 Year Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Malayalam 1 Year Free Regional Pack" />
    <Text style={styles.sectionDescription} label="Kannada 1 Year Free Regional Pack" />
  </View>
);

Basic.args = {
  title: 'Recharge Plan',
  children: body,
  expandIcon: 'add',
  collapseIcon: 'remove',
};
