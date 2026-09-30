import { StyleSheet } from 'react-native';
import { Colors, Outlines, Sizing } from 'styles';

export default StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  imageContainer: {
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    // enable style if require pagination above image
    // position: 'absolute',
    // bottom: Sizing.layout.x10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: Sizing.layout.x10,
    height: Sizing.layout.x10,
    borderRadius: Outlines.borderRadius.small,
    backgroundColor: Colors.neutral.white,
    margin: Sizing.layout.x10,
  },
});
