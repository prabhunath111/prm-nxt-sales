import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from 'store';
import IconTextInput from './IconTextInput';

describe('Test for the component IconTextInput', () => {
  test('render component IconTextInput', () => {
    render(
      <Provider store={store}>
        <IconTextInput />
      </Provider>,
    );
    expect(screen.getByTestId('input-test')).toBeTruthy();
  });

  test('snapshot tests for IconTextInput', () => {
    const component = render(
      <Provider store={store}>
        <View>
          <IconTextInput />
        </View>
      </Provider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
