import React from 'react';
import { View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import styles from './CustomDrawer.styles';

const CustomDrawer = (props: any) => (
  <View style={styles.container}>
    <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.listContainer}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  </View>
);

export default CustomDrawer;
