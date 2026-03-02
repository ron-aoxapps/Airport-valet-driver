import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SkeletonHolder = ({ loading, skeleton, children }) => {
    return (<>
        {loading ? skeleton : children}
    </>

    )
}

export default SkeletonHolder

const styles = StyleSheet.create({})