import React, { useState, useRef } from 'react';
import { Pressable, TextStyle, View, LayoutRectangle, Text, ViewStyle } from 'react-native';
import { Sizing } from 'styles';
import styles from './Tooltip.styles';

export type TooltipProps = {
  text: string;
  children: React.ReactNode;
  tooltipTextStyle?: TextStyle;
  tooltipContainerStyle?: ViewStyle;
};

const Tooltip = ({ text, children, tooltipTextStyle, tooltipContainerStyle }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null);
  const wrapperRef = useRef<View>(null);
  const handleShow = () => setVisible(true);
  const handleHide = () => setVisible(false);

  return (
    <View ref={wrapperRef} onLayout={(event) => setTriggerLayout(event.nativeEvent.layout)} style={styles.container}>
      <Pressable onPressIn={handleShow} onPressOut={handleHide} onHoverIn={handleShow} onHoverOut={handleHide}>
        {children}
      </Pressable>

      {visible && triggerLayout && (
        <View
          style={[
            styles.toolTipStyle,
            {
              top: triggerLayout.y - Sizing.layout.x20,
              left: triggerLayout.x,
            },
            tooltipContainerStyle,
          ]}
        >
          <Text style={[styles.tooltipText, tooltipTextStyle]}>{text}</Text>
        </View>
      )}
    </View>
  );
};

export default Tooltip;
