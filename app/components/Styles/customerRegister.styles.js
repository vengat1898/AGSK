import { StyleSheet,Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  innerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  formWrapper: { width: width * 0.9, alignItems: "center" },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#29CB56",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 0.3,
    borderColor: "#29CB56",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: "#fff",
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  iconButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: "#E6F6EC",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#29CB56",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
export default styles;