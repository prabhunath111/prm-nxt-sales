import { StyleSheet } from 'react-native';
import { Sizing } from 'styles';
import { isWeb } from 'utils/platformHelper';

const styles = StyleSheet.create({
  gradientContainer: {
    ...(isWeb && {
      overflow: 'scroll',
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '-ms-overflow-style': 'none',
    }),
    flex: Sizing.flexSize.x100,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});

export default styles;
