/**
 * this is wraper for bar chart component with dropdowns
 *
 * @module components/ChartWrapper
 * @memberof CommonComponent
 */

import React from 'react';
import { View } from 'react-native';
import BarChart from 'components/sales/BarChart';
import { useTranslation } from 'react-i18next';
import Text from 'components/sales/Text';
import Dropdown from 'components/sales/Dropdown';
import { Colors } from 'styles';
import styles from './ChartWrapper.styles';

/**
 * Component type definitions
 *
 * @typedef {object} ChartWrapperProps
 * @property {boolean} [isCumulativeChart] - boolena check for cumulative and monthwise chart
 */

export type ChartWrapperProps = {
  isCumulativeChart?: boolean;
};

/**
 * Represents a ChartWrapper component
 *
 * @param {object} props - React properties passed from composition
 * @returns {JSX.Element} The rendered ChartWrapper component
 *
 * @example
 * <ChartWrapper text="Hello World!" />
 */

const ChartWrapper = ({ isCumulativeChart = true }: ChartWrapperProps) => {
  const { t } = useTranslation();

  // chart data will be removed when the chart data will come from the API
  const chartData = {
    domainVales: { x: 0, y: 100 },
    axisData: [
      { xAxis: 'May', yAxis: 34 },
      { xAxis: 'Jun', yAxis: 64 },
      { xAxis: 'Jul', yAxis: 82 },
      { xAxis: 'Aug', yAxis: 52 },
      { xAxis: 'Sep', yAxis: 64 },
      { xAxis: 'Oct', yAxis: 32 },
    ],
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Dropdown
          inputFieldStyle={styles.inputStyle}
          innerContainerStyle={{ ...styles.inputContainerStyle, ...styles.dropDownBorder }}
          placeholderTextColor={Colors.neutral.white}
        />
      </View>
      <View style={styles.chartContainer}>
        {isCumulativeChart ? (
          <View style={styles.ftdMtdContainer}>
            <View style={styles.ftdMtd}>
              <Text style={styles.ftdMtdText}>{t('strings.ftd')}</Text>
              <Text style={[styles.ftdMtdText, styles.ftdMtdValue]}>20</Text>
            </View>
            <View style={styles.ftdMtd}>
              <Text style={styles.ftdMtdText}>{t('strings.mtd')}</Text>
              <Text style={[styles.ftdMtdText, styles.ftdMtdValue]}>32</Text>
            </View>
            <View style={styles.container}>
              <Dropdown inputFieldStyle={styles.inputStyle} innerContainerStyle={styles.inputContainerStyle} placeholderTextColor={Colors.neutral.white} />
            </View>
          </View>
        ) : null}
        <BarChart chartData={chartData} />
      </View>
    </View>
  );
};

export default ChartWrapper;
