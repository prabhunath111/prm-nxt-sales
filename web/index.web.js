import { AppRegistry } from 'react-native';
import React from 'react';
import { name as appName } from '../app.json';
import App from 'app/App';
import 'config/i18n';
import './fonts.css';


if (module.hot) {
  module.hot.accept();
}
AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('prm'),
});
