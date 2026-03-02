import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import Colors from "../../constants/Colors";

import Fonts from "../../constants/Fonts";
import { commonStyle, fontSize } from "../../styles/styles";




export const styles = StyleSheet.create({


    container: {
        ...commonStyle.borderRadius,
        height: scale(50),
        backgroundColor: Colors.textInputBackground,
        borderWidth: 1,
        paddingHorizontal: scale(10),
        padding: 0,
        marginVertical: scale(5),
        borderColor: Colors.gray,
        flexDirection: "row",
        alignItems: "center"
    },
    textinput: {
        width: "100%",
        color: Colors.textColor,
        fontSize: fontSize.Medium4,
        fontFamily: Fonts.OpenSans_Medium,
    },
    textInput: {
        flex: 1,
        color: Colors.textColor,
        fontSize: fontSize.Medium4,
        fontFamily: Fonts.OpenSans_Medium,
        paddingVertical: 10,
        paddingLeft: 10
    },
    icon: {
        height: scale(20),
        width: scale(20),
        resizeMode: "contain"
    },
    myshadow: {
        shadowColor: Colors.gray,
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 8.30,
        elevation: 3,
    },
    countryContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    seprator: {
        height: "50%",
        width: 2,
        backgroundColor: Colors.gray,
        marginHorizontal: 5
    },

    addressPickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.darkSecondary,
        height: 50,
        paddingHorizontal: scale(10)
    },
    headerTitle: {
        fontSize: fontSize.Medium3_5,
        marginLeft: 10,
        textTransform: "uppercase",
    },
    modal: {
        marginHorizontal: scale(10)
    },
    addressItem: {
        marginHorizontal: scale(10),
        paddingHorizontal: scale(10),
        marginVertical: 5,
        flexDirection: "row",

    },
    addressText: {
        flex: 1,
        padding: 5,
        // backgroundColor: Colors.gray + 30,
    },
    sepratorH: {
        marginHorizontal: scale(20),
        backgroundColor: Colors.gray,
        height: 1,

    }


});