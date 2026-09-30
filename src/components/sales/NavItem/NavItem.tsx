/**
 * Component for Nav Items in a Navigation Bar
 *
 * @module components/NavItem
 * @memberof - Common Component
 */
import React, { useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import { NavLink } from 'react-router-dom';
import styles from './NavItem.styles';
/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type NavItemProps = {
  link: string;
  title: string;
  index?: number;
  icon?: string;
  isPrimary?: boolean;
};

/**
 * Represents a NavItem component
 *
 * @component
 * @param {object} props - React properties passed from composition
 * @returns NavItem
 */
const NavItem = ({ link, title, index, icon, isPrimary = false }: NavItemProps) => {
  const navStyle = useCallback(
    (isActive: boolean) => (isPrimary ? [isActive ? styles.activeNavPrimary : styles.inactiveNavPrimary] : [isActive ? styles.activeNav : styles.inactiveNav]),
    [isPrimary],
  );

  return (
    <NavLink to={link} style={styles.navLink} key={index}>
      {({ isActive }) => (
        <View id="item" style={[styles.navContainer, navStyle(isActive)]}>
          {icon ? (
            <Image
              height={25}
              width={25}
              borderRadius={5}
              // imgStyles={[styles.icon, { backgroundColor: item.color }]}
              // iconName={}
            />
          ) : null}
          <Text style={styles.navItemText}>{title}</Text>
        </View>
      )}
    </NavLink>
  );
};

export default NavItem;
