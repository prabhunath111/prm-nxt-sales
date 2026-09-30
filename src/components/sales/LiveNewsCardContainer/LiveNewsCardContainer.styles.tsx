import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    width: "100%",
    maxWidth: 1200,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "black",
  },
  viewAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "white",
  },
  viewAllText: {
    color: "#e0098e",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
    textDecorationColor: "#e0098e"
  },
  loadingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 10,
  },
  loadingText: {
    color: "#CFCFCF",
    fontSize: 13,
  },
  errorBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,59,48,0.12)",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 13,
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FF3B30",
  },
  retryLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyText: {
    color: "#9E9E9E",
    fontSize: 13,
    paddingVertical: 12,
  },

  tagsRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f00c6f',
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  tagChipActive: {
    backgroundColor: '#f00c6f', // subtle highlight
    borderColor: '#fff',
    color: "white"
  },
  tagLabel: {
    color: '#f00c6f',
    fontSize: 13,
    fontWeight: '600',
  },
  tagLabelActive: {
    color: '#fff',
  },


});

export default styles;

