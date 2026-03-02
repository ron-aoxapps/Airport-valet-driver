import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types';
import React from 'react'
import { Colors, Fonts } from '../../constants'

const Index = ({ small, medium, large, bold, semibold, textColor, children, style, ...props }) => {

    const fontSize = small ? 13 : medium ? 15 : large ? 18 : 14
    const fontFamily = bold ? Fonts.OpenSans_Bold : semibold ? Fonts.OpenSans_SemiBold : Fonts.OpenSans_Medium
    const color = textColor ? textColor : Colors.textColor


    return (
        <Text style={[styles.textStyle, { fontSize, fontFamily, color }, style]} {...props}>{children}</Text>
    )
}




export default Index

const styles = StyleSheet.create({
    textStyle: {
        fontFamily: Fonts.OpenSans_Regular
    }
})