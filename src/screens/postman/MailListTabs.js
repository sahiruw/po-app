import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTheme } from "../../assets/theme/theme";
import AppbarC from "../../components/AppBarC";

const MailListTabs = () => {
  const mailList = [
    { id: 1, name: "Mail 1", status: "In progress" },
    { id: 2, name: "Mail 2", status: "Delivered" },
    { id: 3, name: "Mail 3", status: "Delivery Failed" },
    { id: 4, name: "Mail 4", status: "In progress" },
    { id: 5, name: "Mail 5", status: "Delivered" },
    { id: 6, name: "Mail 6", status: "Delivery Failed" },
  ];

  const [selectedTab, setSelectedTab] = useState("In progress");

  var { theme } = useTheme();

  const filterMailList = (status) => {
    return mailList.filter((mail) => mail.status === status);
  };

  let today = new Date();
  return (
    <>
      <AppbarC title="Mail List" />
      <View style={styles.container}>
        <View style={[styles.tabs, { borderColor: theme.primaryColor }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "In progress"
                ? { backgroundColor: theme.primaryColor }
                : { backgroundColor: "#f0f0f0" },
            ]}
            onPress={() => setSelectedTab("In progress")}
          >
            <Text style={selectedTab === "In progress"
                ? {color: theme.backgroundColor}
                : {}}>In progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "Delivered"
                ? { backgroundColor: theme.primaryColor }
                : { backgroundColor: "#f0f0f0" },
            ]}
            onPress={() => setSelectedTab("Delivered")}
          >
            <Text style={selectedTab === "Delivered"
                ? {color: theme.backgroundColor}
                : {}}>Delivered</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "Delivery Failed"
                ? { backgroundColor: theme.primaryColor }
                : { backgroundColor: "#f0f0f0" },
            ]}
            onPress={() => setSelectedTab("Delivery Failed")}
          >
  

            <Text style={selectedTab === "Delivery Failed"
                ? {color: theme.backgroundColor}
                : {}}>Delivery Failed</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filterMailList(selectedTab)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.mailItem}>
                <Text>{item.name}</Text>
                <Text>{today.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 0,
  },

  mailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
  },
});

export default MailListTabs;
