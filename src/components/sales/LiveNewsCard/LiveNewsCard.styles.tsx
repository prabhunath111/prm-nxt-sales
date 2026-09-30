import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    width: 190,                 // tweak to your rail cell width
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,        // keeps consistent card size
    justifyContent: 'space-between',
  },
  thumbnailImage: {
    borderRadius: 10,
    backgroundColor: '#1f1f1f',
  },
  topRow: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent:'space-between'
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 10,
    backgroundColor:"#f0ebed",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    opacity: 0.95,
    backgroundColor:"red"
  },
  contentType: {
    color: 'black',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  // timePill: {
  //   marginLeft: 'auto',
  //   // backgroundColor: 'rgba(0,0,0,0.5)',
  //   paddingHorizontal: 8,
  //   height: 22,
  //   borderRadius: 6,
  //   justifyContent: 'center',
  // },
  timeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '200',
  },
  
gradientOverlay: {
  position: 'absolute',
  top: 60,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
},
  bottomOverlay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    // Faux gradient using layered shadows (no extra deps):
    //backgroundColor: 'rgba(0,0,0,0.35)',
    //WebkitBoxShadow: "inset 0px -40px 11px -3px rgba(0,0,0,0.44)",
    // boxShadow: "inset 0px -40px 10px -5px rgba(0,0,0,0.6)"
  },
  textBlock: {
    flex: 1,
    paddingRight: 8,
  },
  contentTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '400',
  },
  subtitle: {
    marginTop: 2,
    color: '#D0D0D0',
    fontSize: 12,
    fontWeight: '500',
  },
  logo: {
    width: 36,
    height: 36,
    // marginLeft: 6,
    borderRadius:50
  },
});

export default styles;







