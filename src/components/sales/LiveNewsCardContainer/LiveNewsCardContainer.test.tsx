import {View} from 'react-native';
import LiveNewsCardContainer from './LiveNewsCardContainer';
import { render, screen } from '@testing-library/react-native';

describe( 'Test for the component LiveNewsCardContainer', () => {
    test('render component LiveNewsCardContainer', () => {
        render(<LiveNewsCardContainer />)
        expect(screen.getByText("LiveNewsCardContainer"))
    });

    test('snapshot tests for LiveNewsCardContainer', () => {
        const component = render(
            <View>
                <LiveNewsCardContainer />
            </View>
        )
        expect(component.toJSON()).toMatchSnapshot();
    });
});