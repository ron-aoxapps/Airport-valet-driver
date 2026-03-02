import React from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import { scale } from 'react-native-size-matters'
import Colors from '../constants/Colors'
import Fonts from '../constants/Fonts'

const SimpleButton = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={[styles.container, props.mainStyle]} >
            <Text style={[styles.title, props.titleStyle]} >
                {props.title}
            </Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',

    },
    title: {
        color: Colors.bgColor,
        fontFamily: Fonts.OpenSans_Bold,
        fontSize: scale(15),
    }

})

export default SimpleButton