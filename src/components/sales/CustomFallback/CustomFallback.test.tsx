import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import CustomFallback from './CustomFallback';

describe('Test for the component CustomFallback', () => {
  test('render component CustomFallback', () => {
    render(<CustomFallback />);
    expect(screen.getByTestId('fallback-test')).toBeTruthy();
  });

  test('snapshot tests for CustomFallback', () => {
    const component = render(
      <View>
        <CustomFallback />
      </View>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
