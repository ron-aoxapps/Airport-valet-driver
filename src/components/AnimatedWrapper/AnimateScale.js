import { Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'

const AnimateScale = ({ index = 0, children, style }) => {

    const scale = useRef(new Animated.Value(0.9)).current
    useEffect(() => {

        Animated.timing(scale, {
            toValue: 1,
            duration: 500,
            delay: index * 100,
            easing: Easing.ease,
            useNativeDriver: true
        }).start()

    })

    return (<Animated.View style={[{ transform: [{ scale }], }, style]}>
        {children}
    </Animated.View>
    )
}

export default AnimateScale

