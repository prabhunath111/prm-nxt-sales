import { StyleSheet } from 'react-native';
import { Sizing, Colors } from 'styles';
import { getScreenWidth } from 'styles/dimentionHelper';

const screenWidth = getScreenWidth();

const styles = StyleSheet.create({
  container: {
    flex: screenWidth <= Sizing.layout.x500 ? undefined : Sizing.layout.x1,
    backgroundColor: Colors.neutral.white,
  },
  innerContainer: {
    width: screenWidth <= Sizing.layout.x500 ? Sizing.layoutP.xp100 : Sizing.layoutP.xp80,
    alignSelf: 'center',
  },
  transactionStyle: {
    margin: Sizing.layout.x10,
  },
  searchStyle: {
    height: Sizing.layout.x26,
    paddingVertical: Sizing.layout.x0,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingTop: Sizing.layout.x10,
    gap: Sizing.layout.x8,
  },
  TransactionCardContainer: {
    flex: screenWidth <= Sizing.layout.x500 ? undefined : Sizing.layout.x1,
    paddingBottom: Sizing.layout.x8,
  },
  filterContainerMobile: {
    flexDirection: 'column',
    margin: Sizing.layout.x10,
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginTop: Sizing.layout.x5,
    gap: Sizing.layout.x5,
    width: Sizing.layout.x800,
  },
  transactionContainer: {
    height: Sizing.layout.x400,
    marginHorizontal: screenWidth <= Sizing.layout.x500 ? Sizing.layout.x8 : null,
    marginTop: Sizing.layout.x10,
    marginBottom: Sizing.layout.x10,
    borderRadius: Sizing.layout.x5,
    padding: screenWidth <= Sizing.layout.x500 ? null : Sizing.layout.x5,
    backgroundColor: Colors.violet.v50,
  },
  distance: {
    gap: Sizing.layout.x8,
  },
  centerStyle: { flex: Sizing.layout.x1, justifyContent: 'center', alignItems: 'center' },
  searchContatiner: {
    width: Sizing.layoutP.xp20,
  },
});

export default styles;
