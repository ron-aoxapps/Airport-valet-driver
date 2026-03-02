import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import RNModal from './Modal'
import { Text } from '..'
import { useSelector } from 'react-redux'
import { Colors } from '../../constants'
import { store } from '../../redux/store'
import { saveAlertData } from '../../module/Common/actions'


export const showCustomAlert = (
    title = '',
    message = '',
    arrayButtonsToShow,
) => {
    store.dispatch(
        saveAlertData({
            title: title,
            message: message,
            arrayButtonsToShow: arrayButtonsToShow,
        }),
    );
};


const RNAlert = () => {

    const { shouldShowAlert, alertData } = useSelector(state => ({
        shouldShowAlert:
            state.common !== undefined
                ? state.common.alertData !== undefined &&
                state.common.alertData.message !== undefined
                : false,
        alertData: state.common.alertData || {},
    }))

    // console.log('alertData', alertData)

    const onHideAlert = () => {
        store.dispatch(
            saveAlertData({}),
        );
        // alert('')

    }

    return (
        <RNModal style={styles.modal} visible={shouldShowAlert}>

            <View style={styles.mainViewStyle}>

                {/* TITLE OF HEADER */}
                <Text bold large style={styles.titleTextStyle}>
                    {alertData.title}
                </Text>

                {/* MIDDLE TEXT VIEW */}
                <View style={styles.middleTextView}>
                    <Text >
                        {alertData.message}
                    </Text>
                </View>

                {/* BOTTOM BUTTON VIEW */}
                {alertData.arrayButtonsToShow !== undefined
                    ? alertData.arrayButtonsToShow.map((data) => {
                        return (
                            <TouchableOpacity
                                style={[styles.OkButtonView]}
                                key={data.text}
                                onPress={() => {
                                    onHideAlert();
                                    if (data.onPress !== undefined) data.onPress();
                                }}>

                                <Text
                                    style={[styles.OkTextStyle]}

                                    textColor={data.isNotPreferred ? Colors.primary : Colors.LightBlue}
                                >
                                    {data.text}
                                </Text>
                            </TouchableOpacity>
                        );
                    })
                    : null}
            </View>

        </RNModal>
    )
}

export default RNAlert

const styles = StyleSheet.create({
    modal: {
        minHeight: 10,
        borderRadius: 10,
        paddingBottom: 0,
    },
    mainViewStyle: {
        paddingBottom: 15,
    },
    OkButtonView: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        borderRadius: 16,
        marginHorizontal: 5,


    },
    titleTextStyle: {
        alignSelf: "center"
    },
    middleTextView: {
        marginVertical: 10,

    }
})