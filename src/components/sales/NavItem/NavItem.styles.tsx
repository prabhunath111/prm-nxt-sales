import { StyleSheet } from 'react-native';
import { Sizing, Colors } from 'styles';

const styles = StyleSheet.create({
  navLink: {
    textDecorationLine: 'none',
  },
  navContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizing.x10,
  },
  activeNavPrimary: {
    backgroundColor: Colors.primary.theme,
  },
  inactiveNavPrimary: {
    backgroundColor: Colors.primary.brand,
  },
  activeNav: {
    backgroundColor: Colors.secondary.theme,
  },
  inactiveNav: {
    backgroundColor: Colors.neutral.white,
  },
  icon: {},
  navItemText: {
    color: Colors.neutral.white,
  },
});

export default styles;
