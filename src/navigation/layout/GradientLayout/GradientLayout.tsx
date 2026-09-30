import React, { FC, ReactNode } from 'react';
import { Colors, Sizing } from 'styles';
import Gradient from 'components/sales/Gradient';
import styles from './GradientLayout.styles';

export type GradientLayoutProps = {
  children: ReactNode;
};

const GradientLayout: FC<GradientLayoutProps> = ({ children }) => (
  <Gradient
    start={{ x: Sizing.layout.x1, y: Sizing.layout.x0 }}
    end={{ x: Sizing.layout.x1, y: Sizing.layout.x1 }}
    colors={Colors.gradient.pinkGradient}
    style={styles.gradientContainer}
  >
    {children}
  </Gradient>
);

export default GradientLayout;
