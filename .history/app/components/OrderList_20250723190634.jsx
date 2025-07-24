import { SessionContext } from "@/context/SessionContext";
import api from "@/services/api";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
const OrderList = () => {
  const router = useRouter();
  const { session, getUserMobile, getUserId, getUserName, getUserType } =
    useContext(SessionContext);

  const fetchOrderList = async () => {
    const mobile = await getUserMobile();
    const response = api.get(`/Account/account?mobile=${mobile}`);
  };

  return (
    <View>
      <Text>OrderList</Text>
    </View>
  );
};

export default OrderList;

const styles = StyleSheet.create({});
