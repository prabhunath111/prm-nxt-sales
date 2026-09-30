/**
 * Accordions are useful when we want to toggle between hiding and showing large amount of content
 *
 * @module components/Accordion
 * @memberof - Common Component
 */
import React, { useState, ReactNode, useCallback } from 'react';
import { LayoutAnimation, TouchableOpacity, View } from 'react-native';
import { Sizing } from 'styles';
import { Image, Text } from 'components/sales';
import { ICONS } from 'const';
import { useInflection } from 'wrappers/inflection/InflectionProvider';
import { gcs } from 'styles/webBreakpoints';
import styles from './Accordion.styles';

/**
 * Component type definitions
 *
 * @type {object}
 * @property {string} text - content for the component
 */
export type AccordionProps = {
  title: string;
  children?: ReactNode;
  accordionStyle?: object;
  expandIcon?: string;
  collapseIcon?: string;
  buttonStyle?: object;
  titleColor?: string;
  listStyle?: object;
  isDimension?: boolean;
  iconHeight?: number;
  iconWidth?: number;
  subDetails?: string;
  subDetailsTextStyle?: object;
  isOpenDefault?: boolean;
  dataCount?: number;
  iconStyle?: object;
};

/**
 * Represents a Accordion component
 *
 * @method
 * @param {object} props - React properties passed from composition
 * @returns Accordion
 */
const Accordion = ({
  title,
  children,
  accordionStyle,
  expandIcon = ICONS.CHEVRONDOWN,
  collapseIcon = ICONS.CHEVRONUP,
  buttonStyle = {},
  titleColor,
  listStyle,
  isDimension,
  iconHeight,
  iconWidth,
  subDetails,
  subDetailsTextStyle,
  isOpenDefault,
  dataCount,
  iconStyle,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const { inflection } = useInflection();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isOpen]);

  return (
    <View style={{ ...styles.container, ...accordionStyle }} id="header" testID="header">
      <TouchableOpacity
        onPress={toggleOpen}
        style={[styles.buttonStyle, styles[gcs('buttonStyle', inflection, true, ['md', 'lg', 'xl'])], buttonStyle]}
        activeOpacity={Sizing.layout.xDot6}
        id="button"
        testID="button"
      >
        <Text style={[styles.textStyle, { color: titleColor }]}>
          {title} {dataCount ? `(${dataCount})` : null}
        </Text>
        <View style={styles.subContainer}>
          <Text label={subDetails} style={[styles.subDetailsText, subDetailsTextStyle]} />
          <Image
            iconName={isOpen ? collapseIcon : expandIcon}
            height={iconHeight || Sizing.layout.x1}
            width={iconWidth || Sizing.layout.x1}
            isDimension={isDimension}
            style={iconStyle}
          />
        </View>
      </TouchableOpacity>
      {isOpen ? <View style={[styles.sectionList, listStyle]}>{children}</View> : null}
    </View>
  );
};

export default Accordion;
