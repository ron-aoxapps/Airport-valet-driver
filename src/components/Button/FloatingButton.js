import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants'
import { scale } from 'react-native-size-matters'
import Icon from 'react-native-vector-icons/Feather'

const FloatingButton = ({ check, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.FloatingButton}>
            <Icon name={check ? "check" : "arrow-right"} color={"white"} size={45} />
        </TouchableOpacity>
    )
}

export default FloatingButton

const styles = StyleSheet.create({
    FloatingButton: {
        height: scale(60),
        width: scale(60),
        borderRadius: 50,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 50,
        right: 10
    }
})