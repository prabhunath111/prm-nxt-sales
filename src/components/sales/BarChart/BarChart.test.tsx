import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import BarChart from './BarChart';

describe('Test for the component BarChart', () => {
  test('render component BarChart', () => {
    render(<BarChart />);
    expect(screen.getByTestId('barChartTest')).toBeTruthy();
  });

  test('snapshot tests for BarChart', () => {
    const component = render(
      <View>
        <BarChart />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
