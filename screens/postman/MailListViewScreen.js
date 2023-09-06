import React from 'react';
import { View, StyleSheet } from 'react-native';
import MailListTabs from './MailListTabs'; // Import the MailListView component

const SampleMailList = () => {
  // Sample mailList data
  const mailList = [
    { id: 1, name: 'Mail 1', status: 'In progress' },
    { id: 2, name: 'Mail 2', status: 'Delivered' },
    { id: 3, name: 'Mail 3', status: 'Delivery Failed' },
    { id: 4, name: 'Mail 4', status: 'In progress' },
    { id: 5, name: 'Mail 5', status: 'Delivered' },
    { id: 6, name: 'Mail 6', status: 'Delivery Failed' },
  ];

  return (
    <View style={styles.container}>
      <MailListTabs mailList={mailList} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});

export default SampleMailList;
