import {View} from 'react-native';
import LiveNewsCard from './LiveNewsCard';
import { render, screen } from '@testing-library/react-native';

describe( 'Test for the component LiveNewsCard', () => {
    test('render component LiveNewsCard', () => {
        render(<LiveNewsCard />)
        expect(screen.getByText("LiveNewsCard"))
    });

    test('snapshot tests for LiveNewsCard', () => {
        const component = render(
            <View>
                <LiveNewsCard />
            </View>
        )
        expect(component.toJSON()).toMatchSnapshot();
    });
});