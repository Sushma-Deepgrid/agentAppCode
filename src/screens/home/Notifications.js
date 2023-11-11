
import React from 'react';
import { StyleSheet, Text, FlatList, Image, View } from 'react-native';
import { COLORS, IMGS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Notifications = () => {
  const notificationData = [
    // ... your notification data
  ];

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Image
        source={item.Logo}
        resizeMode="contain"
        style={styles.image}
      />
      <View>
        <Text style={{ fontSize: 18, color: COLORS.black }}>
          {item.TaskId} - {item.TaskName}
        </Text>
        <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: 'bold' }}>
          {item.TaskTime}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.maincontainer}>
      {notificationData.length === 0 ? (
        <View style={styles.noNotificationsContainer}>
          <Ionicons name="notifications-outline" size={50} color={COLORS.primary} />
          <Text style={styles.noNotificationsText}>No notifications</Text>
        </View>
      ) : (
        <FlatList 
          data={notificationData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
        />
      )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  maincontainer: {
    padding: 20,
    backgroundColor: '#fff',
    height: '95%'
  },
  notificationCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Use 25 for a circular shape
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 20
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  noNotificationsText: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 10
  }
});
