import { StyleSheet, Text, View } from 'react-native'
import React,{ useCallback, useContext, useState } from "react";
import api from "@/services/api"
import { SessionContext } from "@/context/SessionContext"; 
import { useRouter } from 'expo-router';
const OrderList = () => {
      const router = useRouter();
      const { session, getUserMobile, getUserId, getUserName, getUserType } =
        useContext(SessionContext);

        const fetch


  return (
    <View>
      <Text>OrderList</Text>
    </View>
  )
}

export default OrderList

const styles = StyleSheet.create({})