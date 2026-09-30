/**
 * Custom component for the Bar charts in Dashboard
 *
 * @module components/BarChart
 * @memberof CommonComponent
 */

import React from 'react';
import { Colors, Sizing } from 'styles';
import { ParentObject } from 'store/sales/types/common';
import { getFullScreenWidth } from 'styles/dimentionHelper';
import { STRINGS } from 'const';
import { View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel } from './Charts';
import styles from './BarChart.styles';

export type BarChartProps = {
  chartData?: ParentObject;
};

/**
 * Represents a BarChart component
 *
 * @param {object} props - React properties passed from composition
 * @param {object} [props.chartData] - The content for the component
 * @returns {JSX.Element} The rendered BarChart component
 *
 * @example
 * <BarChart chartData={data} />
 */

const BarChart = ({ chartData }: BarChartProps) => {
  const { axisData = [], domainVales = { x: Sizing.layout.x0, y: Sizing.layout.x0 } } = chartData || {};

  return (
    <View style={styles.container} testID="barChartTest">
      <VictoryChart
        width={getFullScreenWidth() - Sizing.layout.x35}
        theme={VictoryTheme.material}
        domainPadding={{ x: Sizing.layout.x20 }}
        style={{
          background: { fill: Colors.appColors.indigo },
          parent: { marginTop: -Sizing.layout.x30 },
        }}
        domain={{ y: [domainVales?.x, domainVales.y] }}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: Colors.violet.v400 },
            tickLabels: { fill: Colors.neutral.white, fontSize: Sizing.layout.x15 },
            grid: { stroke: Colors.violet.v400, strokeDasharray: Sizing.layout.x0 },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: Colors.violet.v400 },
            tickLabels: { fill: Colors.neutral.white, fontSize: Sizing.layout.x15 },
            grid: { stroke: Colors.violet.v400, strokeDasharray: Sizing.layout.x0 },
          }}
          tickValues={axisData?.map((point: ParentObject) => point?.xAxis)}
        />
        <VictoryBar
          data={axisData}
          x={STRINGS.X_AXIS}
          y={STRINGS.Y_AXIS}
          style={{ data: { fill: Colors.appColors.paleBlue, width: Sizing.layout.x35 } }}
          animate={{
            duration: Sizing.layout.x3000,
            easing: 'bounce',
            onLoad: { duration: Sizing.layout.x1000 },
          }}
          labels={({ datum }) => datum.yAxis}
          labelComponent={<VictoryLabel dy={-Sizing.layout.x4} style={{ fill: Colors.neutral.white, fontSize: Sizing.layout.x12 }} />}
        />
      </VictoryChart>
    </View>
  );
};

export default BarChart;
