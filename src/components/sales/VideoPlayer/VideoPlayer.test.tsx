import {View} from 'react-native';
import VideoPlayer from './VideoPlayer';
import { render, screen } from '@testing-library/react-native';

describe( 'Test for the component VideoPlayer', () => {
    test('render component VideoPlayer', () => {
        render(<VideoPlayer />)
        expect(screen.getByText("VideoPlayer"))
    });

    test('snapshot tests for VideoPlayer', () => {
        const component = render(
            <View>
                <VideoPlayer />
            </View>
        )
        expect(component.toJSON()).toMatchSnapshot();
    });
});