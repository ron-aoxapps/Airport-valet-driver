import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { Colors } from '../../constants'
import { scale } from 'react-native-size-matters'

const SkeletonListView = ({ header = false }) => {
  return (
    <SkeletonPlaceholder
    >
      {header ? <>
        <View
          style={styles.header}
        />
        <View
          style={styles.header_desc}
        />

      </> : null}

      {new Array(5).fill("").map((_, index) => {
        return <View
          key={index}
          style={styles.list}
        />
      })}


    </SkeletonPlaceholder>
  )
}
const SkeletonEarningView = ({ header = false }) => {
  return (
    <SkeletonPlaceholder>

      {new Array(3).fill("").map((_, index) => <SkeletonPlaceholder.Item key={index} marginVertical={10}>
        <View style={styles.earning_image} />
        <View style={styles.earning_usd} />
        <View style={styles.earning_name} />
      </SkeletonPlaceholder.Item>)}



    </SkeletonPlaceholder>
  )
}

const SkeletonTicketDetailView = ({ header = false }) => {
  return (
    <SkeletonPlaceholder>

      <SkeletonPlaceholder.Item marginVertical={10}>
        <View style={styles.earning_image} />
        <SkeletonPlaceholder.Item flexDirection='row' marginVertical={10}>
          <View style={styles.ticket_status} />
          <View style={styles.ticket_status} />
        </SkeletonPlaceholder.Item>
        <View style={styles.earning_name} />




        {new Array(3).fill("").map((_, index) =>
          <SkeletonPlaceholder.Item key={index} marginVertical={10} flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item width={30} height={30} borderRadius={50} />
            <SkeletonPlaceholder.Item marginLeft={10}>
              <SkeletonPlaceholder.Item width={120} height={15} borderRadius={4} />
              <SkeletonPlaceholder.Item
                marginTop={6} width={80} height={15} borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>)}


      </SkeletonPlaceholder.Item>

    </SkeletonPlaceholder>
  )
}


export { SkeletonListView, SkeletonEarningView, SkeletonTicketDetailView }

const styles = StyleSheet.create({
  header: {
    height: scale(60),
    borderRadius: scale(5)
  },
  header_desc: {
    marginVertical: 20,
    height: scale(20),
    width: "60%",
    borderRadius: scale(5)
  },
  list: {
    marginVertical: 10,
    height: scale(30),
    width: "100%",
    borderRadius: scale(5)

  },
  earning_image: {
    height: scale(60),
    width: "100%",
    borderRadius: scale(5),

  },
  earning_usd: {
    borderRadius: scale(2),
    height: scale(20),
    width: "60%",

    marginVertical: scale(10)
  },
  earning_name: {
    height: scale(10),
    borderRadius: scale(2),
    width: "40%",
  },
  ticket_status: {
    borderRadius: scale(2),
    marginRight: scale(10),
    height: scale(20),
    width: 100
  }
})