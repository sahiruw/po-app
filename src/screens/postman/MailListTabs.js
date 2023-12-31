import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTheme } from "../../assets/theme/theme";
import AppbarC from "../../components/AppBarC";
import { MailListContext } from "../../contextStore/MailListProvider";
import { AppConstants } from "../../assets/constants";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from "@react-navigation/core";
import EmailDeliveryPopup from "../../components/EmailDeliveryPopup";
import routeService from "../../services/routeService";
import LoadingScreen from "../LoadingScreen";

const MailListTabs = () => {
  const [mailListToDisplay, setMailListToDisplay] = useState([]);
  const { mailList, setMailList } = useContext(MailListContext);
  const [selectedTab, setSelectedTab] = useState(AppConstants.MailItemStatus.OutforDelivery);
  var { theme } = useTheme();
  const navigation = useNavigation();
  const [isEmailPopupVisible, setEmailPopupVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMailList = async () => {
    setIsLoading(true);
    let route = await routeService.getRouteForToday();
    setMailList(route.mailItemData);
    console.log("Mail List fetched from API");
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMailList();
  }, []);

  const handleYesPress = () => {
    // Handle "Yes" button press here
    setEmailPopupVisible(false);
    navigation.navigate("DeliverySubmission", { isMailDelivered: true, marker: selectedMarker });
  };

  const handleNoPress = () => {
    // Handle "No" button press here
    setEmailPopupVisible(false);
    navigation.navigate("DeliverySubmission", { isMailDelivered: false, marker: selectedMarker });
  };

  const handleClosePress = () => {
    // Handle "Close" button press here
    setEmailPopupVisible(false);
  };

  useEffect(() => {
    if (mailList) {
      let mailListTemp = [];

      mailList.forEach((mail) => {
        mailListTemp.push({
          id: mail.id,
          name: mail.receiver_name,
          status: mail.status,
          type: mail.type,
          mailItem: mail,
        });
      });
      setMailListToDisplay(mailListTemp);
    }
  }, [mailList]);

  const filterMailList = (status) => {
    return mailListToDisplay.filter((mail) => mail.status === status);
  };

  const handleMarkAttempt = (item) => {
    // console.log("handleMarkAttempt", item.mailItem);
    if (selectedTab === AppConstants.MailItemStatus.OutforDelivery) {
      setSelectedMarker(item.mailItem);
      setEmailPopupVisible(true);
    }
  };


  return (
    <>
    {isLoading && <LoadingScreen />}
    <EmailDeliveryPopup
        isVisible={isEmailPopupVisible}
        onYesPress={handleYesPress}
        onNoPress={handleNoPress}
        onClosePress={handleClosePress}
      />
      <AppbarC title="Mail List" />
      <View style={styles.container}>
        <View style={[styles.tabs, { borderColor: theme.primaryColor }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === AppConstants.MailItemStatus.OutforDelivery
                ? { backgroundColor: theme.primaryColor }
                : { backgroundColor: "#f0f0f0" },
            ]}
            onPress={() =>
              setSelectedTab(AppConstants.MailItemStatus.OutforDelivery)
            }
          >
            <Text
              style={
                selectedTab === AppConstants.MailItemStatus.OutforDelivery
                  ? { color: theme.backgroundColor }
                  : {}
              }
            >
              In progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === AppConstants.MailItemStatus.Delivered
                ? { backgroundColor: theme.primaryColor }
                : { backgroundColor: "#f0f0f0" },
            ]}
            onPress={() =>
              setSelectedTab(AppConstants.MailItemStatus.Delivered)
            }
          >
            <Text
              style={
                selectedTab === AppConstants.MailItemStatus.Delivered
                  ? { color: theme.backgroundColor }
                  : {}
              }
            >
              Delivered
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === AppConstants.MailItemStatus.Failed
                ? { backgroundColor: theme.primaryColor }
                : { backgroundColor: "#f0f0f0" },
            ]}
            onPress={() => setSelectedTab(AppConstants.MailItemStatus.Failed)}
          >
            <Text
              style={
                selectedTab === AppConstants.MailItemStatus.Failed
                  ? { color: theme.backgroundColor }
                  : {}
              }
            >
              Delivery Failed
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filterMailList(selectedTab)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => {handleMarkAttempt(item)}}
            >
              <View style={styles.mailItem}>
                <Text>{item?.mailItem?.recipient_name}</Text>
                <Text>{String(item.type).toUpperCase()}</Text>
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
