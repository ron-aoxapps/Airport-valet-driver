
import { StyleSheet } from "react-native"
import { scale } from "react-native-size-matters"
import { Colors, Fonts } from "../../../constants"
import { wp } from "../../../utils/commonFunction"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: scale(15),
    },
    title: {

        marginTop: "10%",
        textTransform: "uppercase"
    },
    description: {
        marginTop: 20,
        width: "90%",
        marginBottom: "10%",
        textTransform: "uppercase"
    },
    button: {
        marginTop: "5%",

    },
    textContainer: {
        marginTop: "10%",
        alignSelf: "center",

    },
    descText: {
        marginVertical: 10
    },
    validator: {
        flexDirection: "row",
        alignItems: "center"
    },
    validIcon: {
        height: 20,
        width: 20,
        borderRadius: 30,
        backgroundColor: Colors.gray + 80,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5,
        marginVertical: 5
    },
    haveAccount: {
        flexDirection: "row",
        marginTop: wp("10%"),
        justifyContent: "center",
        paddingBottom: scale(10)
    },
    haveAccountText: {
        color: Colors.textColor + 90
    },





})