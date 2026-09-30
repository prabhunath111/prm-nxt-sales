import { View } from 'react-native';
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.styles';

const AuthLayout = () => (
  <View style={styles.nav}>
    <Outlet />
  </View>
);

export default AuthLayout;
