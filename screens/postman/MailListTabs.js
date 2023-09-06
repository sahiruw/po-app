import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from "../../assets/theme/theme";


const MailListTabs = ({ mailList }) => {
  const [selectedTab, setSelectedTab] = useState('In progress');
  const [selectedMail, setSelectedMail] = useState(null);
  var { theme } = useTheme();

  const filterMailList = (status) => {
    return mailList.filter((mail) => mail.status === status);
  };

  const openMailDetails = (mail) => {
    setSelectedMail(mail);
  };

  const closeMailDetails = () => {
    setSelectedMail(null);
  };
  let today = new Date()
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'In progress' ? { backgroundColor: theme.primaryColor } : { backgroundColor: '#f0f0f0' },
          ]}
          onPress={() => setSelectedTab('In progress')}
        >
          <Text>In progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'Delivered' ? { backgroundColor: theme.primaryColor } : { backgroundColor: '#f0f0f0' },
          ]}
          onPress={() => setSelectedTab('Delivered')}
        >
          <Text>Delivered</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'Delivery Failed' ? { backgroundColor: theme.primaryColor } : { backgroundColor: '#f0f0f0' },
          ]}
          onPress={() => setSelectedTab('Delivery Failed')}
        >
          <Text>Delivery Failed</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filterMailList(selectedTab)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openMailDetails(item)}>
            <View style={styles.mailItem}>
              <Text>{item.name}</Text>
              <Text>{today.toLocaleString()}</Text>

            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        isVisible={selectedMail !== null}
        onBackdropPress={closeMailDetails}
        style={styles.modal}
      >
        {selectedMail && (
          <View style={styles.modalContent}>
            <Text>Name: {selectedMail.name}</Text>
            <Text>Status: {selectedMail.status}</Text>
            {/* Add more details here */}
            <TouchableOpacity onPress={closeMailDetails} style={styles.closeButton}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 0,
  },

  mailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    n
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
});

export default MailListTabs;
