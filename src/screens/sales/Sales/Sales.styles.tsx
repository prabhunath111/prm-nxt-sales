import { StyleSheet } from 'react-native';
import { Sizing } from 'styles';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create<any>({
  cardContainer: {
    ...(isWeb && {
      overflow: 'scroll',
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
    }),
    paddingBottom: Sizing.layout.x10,
  },
  cardContainer_md: {
    marginTop: Sizing.layout.x0,
    padding: Sizing.layout.x20,
  },
  cardContainer_lg: {
    marginTop: Sizing.layout.x0,
    padding: Sizing.layout.x20,
  },
  cardContainer_xl: {
    marginTop: Sizing.layout.x0,
    padding: Sizing.layout.x20,
  },
  header: {
    display: 'none',
    marginHorizontal: Sizing.layoutP.xp4,
  },
  header_md: {
    display: 'block',
    marginTop: Sizing.layout.x15,
  },
  header_lg: {
    display: 'block',
    marginTop: Sizing.layout.x15,
  },
  header_xl: {
    display: 'block',
    marginTop: Sizing.layout.x15,
  },
});

export default styles;
