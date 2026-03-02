import { Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'

const AnimateSlideUp = ({ index = 0, children }) => {

    const translateY = useRef(new Animated.Value(10)).current
    useEffect(() => {

        Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            delay: index * 100,
            easing: Easing.ease,
            useNativeDriver: true
        }).start()

    })

    return (<Animated.View style={{
        width: "100%", alignItems: "center",
        transform: [{ translateY }]
    }}>
        {children}
    </Animated.View>
    )
}

export default AnimateSlideUp

