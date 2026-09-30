import { View } from 'react-native';
import { Outlet } from 'react-router-dom';
import { NavContainer } from 'components/sales';
import styles from './ChildLayout.styles';

const ChildLayout = ({ child }: any) => (
  <>
    <View style={styles.nav}>
      <NavContainer data={child} isPrimary={false} />
    </View>
    <Outlet />
  </>
);

export default ChildLayout;
