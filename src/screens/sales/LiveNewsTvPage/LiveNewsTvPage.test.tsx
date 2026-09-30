import {View} from 'react-native';
import LiveNewsTvPage from './LiveNewsTvPage';
import { render, screen } from '@testing-library/react-native';

describe( 'Test for the component LiveNewsTvPage', () => {
    test('render component LiveNewsTvPage', () => {
        render(<LiveNewsTvPage />)
        expect(screen.getByText("LiveNewsTvPage"))
    });

    test('snapshot tests for LiveNewsTvPage', () => {
        const component = render(
            <View>
                <LiveNewsTvPage />
            </View>
        )
        expect(component.toJSON()).toMatchSnapshot();
    });
});