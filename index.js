/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import StorybookUIRoot from './.ondevice/Storybook';
import 'config/i18n';
import env from 'config/env';
import AppRoot from 'app/App';
import { name as appName } from './app.json';

const App = env.LOAD_STORYBOOK === 'true' ? StorybookUIRoot : AppRoot;

AppRegistry.registerComponent(appName, () => App);
