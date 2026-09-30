/**
 * Card component used for card view in the project
 *
 * @module components/Card
 * @memberof - Common Component
 */
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import styles from './Card.styles';

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type CardProps = {
  children?: ReactNode;
  cardStyle?: object;
  childrenStyle?: object;
};

/**
 * Represents a Card component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Card
 */
const Card = ({ children, cardStyle, childrenStyle }: CardProps) => (
  <View style={[styles.container, cardStyle]} testID="card-test">
    <View style={[styles.centerElement, childrenStyle]}>{children}</View>
  </View>
);

export default Card;
