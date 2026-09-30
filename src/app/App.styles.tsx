import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from 'styles';

interface Styles {
  container: ViewStyle;
  secureContainer: ViewStyle;
  secureCard: ViewStyle;
  secureTitle: TextStyle;
  secureMessage: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  secureContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  secureCard: {
    backgroundColor: Colors.neutral.white,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  secureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.error.primary,
    marginBottom: 15,
  },
  secureMessage: {
    fontSize: 16,
    color: Colors.neutral.black,
    textAlign: 'center',
    lineHeight: 24,
  },
});



export default styles;
