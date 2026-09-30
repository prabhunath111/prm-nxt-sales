/**
 * Component to group all the Navigation Items
 *
 * @module components/NavContainer
 * @memberof - Common Component
 */
import React, { Fragment } from 'react';
import { View } from 'react-native';
import NavItem from 'components/sales/NavItem';
import { Route } from 'navigation/routes/RouteTypes';
import styles from './NavContainer.styles';
/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type NavContainerProps = {
  data: Array<Route>;
  isPrimary: boolean;
};

/**
 * Represents a NavContainer component
 *
 * @component
 * @param {object} props - React properties passed from composition
 * @returns NavContainer
 */
const NavContainer = ({ data, isPrimary }: NavContainerProps) => (
  <View style={styles.navContainer} testID="navcontainer-test">
    {data?.map((obj, index) => (
      <Fragment key={obj.path}>
        <NavItem link={obj.path || '/'} title={obj.menuTitle || ''} index={index} isPrimary={isPrimary} />
      </Fragment>
    ))}
  </View>
);

export default NavContainer;
