import React, { useContext } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { MailListContext } from "../contextStore/MailListProvider";
import PieChart from "./Piechart";
import { AppConstants } from "../assets/constants";

const ProfileCard = () => {
  const { mailList, setMailList } = useContext(MailListContext);

  const data = [
    {
      label: AppConstants.MailItemStatus.TobeDelivered,
      value: 30,
      color: "blue",
    },
    { label: AppConstants.MailItemStatus.Delivered, value: 20, color: "green" },
    { label: AppConstants.MailItemStatus.Failed, value: 50, color: "orange" },
  ];

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Mail Statistics
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <PieChart data={data} />
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            left: -20,
          }}
        >
          {data.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={[
                    styles.circle,
                    { backgroundColor: item.color },
                  ]}
                ></View>
                <Text>
                  {item.label}
                  {"\n"}
                  {item.value}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 10,
    height: 30, 
    borderRadius: 5, 
    marginHorizontal: 5,

  },
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    marginTop: 20,
  },
  userData: {
    marginLeft: 10,
  },

  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProfileCard;
