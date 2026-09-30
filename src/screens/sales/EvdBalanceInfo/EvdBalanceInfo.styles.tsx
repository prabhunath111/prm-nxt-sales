import { StyleSheet } from 'react-native';
import { Colors, Forms, Sizing } from 'styles';

const styles = StyleSheet.create<any>({
  container: {
    flex: Sizing.flexSize.x100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
  },
  buttonContainer: {
    ...Forms.buttonContainer.shadowContainer,
    backgroundColor: Colors.neutral.white,
    marginTop: Sizing.layout.x12,
    paddingVertical: Sizing.layout.x5,
    gap: Sizing.layout.x5,
    width: Sizing.layoutP.xp100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: Sizing.layout.x1,
    width: Sizing.layout.x250,
  },
});

export default styles;
