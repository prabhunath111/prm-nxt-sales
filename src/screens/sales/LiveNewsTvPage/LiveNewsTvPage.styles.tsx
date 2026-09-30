import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* ================= VIDEO ================= */
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },

  video: {
    width: '100%',
    height: '100%',
  },

  /* ================= INFO CARD ================= */
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 0,
    padding: 16,
    elevation: 6,
  },

  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  channelLogo: {
    width: 84,
    height: 84,
    marginRight: 12,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "rgba(144, 149, 176, 0.2)"
  },
  channelHD: {
    color: "white",
    backgroundColor: "rgba(136, 11, 224,1)",
    borderRadius: 10,
    position: "absolute",
    zIndex: 10,
    paddingHorizontal: 3,
    paddingVertical: 2,
    fontSize: 8,
    textAlign: "center",
    right: 18,
    top: 8,
  },
  channelNumberPill: {
    color: "black",
    borderWidth: 3,
    borderRadius: 10,
    padding: 2,
    fontSize: 10,
    borderColor: "rgba(144, 149, 176, 0.5)",
    fontWeight: "bold",
    position: 'absolute',
    bottom: -5,
    left: 20,
  },
  channelTextWrap: {
    flex: 1,
  },

  channelName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },

  programTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },

  programTime: {
    fontSize: 14,
    color: '#777777',
    marginTop: 2,
  },
  onNowContainer: {
    color: "black",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "black",
    padding: 10,
    margin: 2,
    display: "contents",
    backgroundColor:"red",
  },
  onNow: {
    fontSize: 14,
    color:"rgba(136, 11, 224, 1)",
    padding: 10,
    fontWeight:"bold",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5, // Must be half of width/height for a perfect circle
    backgroundColor: "rgba(136, 11, 224, 1)",
  },

  moreIcon: {
    paddingHorizontal: 8,
  },

  moreIconText: {
    fontSize: 18,
    color: '#999999',
  },

  audioRow: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:10,

  },

  audioLabel: {
    fontSize: 18,
    color: 'black',
    marginRight: 8,
  },

  audioActive: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
  },

  /* ================= MORE LIKE THIS ================= */
  moreLikeSection: {
    padding: 2,
    backgroundColor:"#eae6ed",
  },

  moreLikeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  languagePill: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },

  languagePillActive: {
    backgroundColor: '#FDECEA',
    borderColor: '#D32F2F',
  },

  languageText: {
    fontSize: 13,
    color: '#666666',
  },

  languageTextActive: {
    color: '#D32F2F',
    fontWeight: '600',
  },

  recommendationRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  recommendationCard: {
    width: '48%',
  },

  recommendationImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },

  recommendationTitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#111',
  },
});