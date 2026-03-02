import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import { Text } from '..'
import { useNavigation } from '@react-navigation/native'

const index = ({ title, back = true, onBack, rightComponent, white }) => {
    const { goBack } = useNavigation()
    return (
        <View style={styles.container}>

            {back ? <TouchableOpacity activeOpacity={0.5} onPress={() => { onBack ? onBack() : goBack() }} style={styles.button}>
                <Icon name='arrowleft' size={30} color={white ? "white" : "black"} />
            </TouchableOpacity> :
                <View style={styles.button} />
            }
            {title ?
                <Text large bold style={styles.text}>{title}</Text> : null}

            {rightComponent ?
                <View style={{}}>{rightComponent}</View>
                :
                <View style={styles.button} />}

        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5

        // backgroundColor: "red"
    },
    button: {
        width: 40,
    },
    text: {

    }
})