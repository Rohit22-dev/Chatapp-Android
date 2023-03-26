import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Avatar, Box, VStack, HStack} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';

const Profile = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.counter.user);
  return (
    <Box style={styles.root}>
      <Box
        style={{backgroundColor: 'tomato', position: 'absolute'}}
        w="100%"
        h="20%"
      />
      <Box mt="20%" w="100%" style={styles.page}>
        <Avatar image={{uri: user.photoURL}} size={140} />
        <VStack spacing={15}>
          <HStack spacing={10} center={true}>
            <Icon name="mail" color="peru" size={30} />
            <Text style={styles.data}>{user.displayName}</Text>
          </HStack>
          {/* <Flex inline={true} gap={10} center={true}> */}
          <HStack spacing={10} center={true}>
            <Icon name="person" color="peru" size={30} />
            <Text style={styles.data}>{user.email}</Text>
          </HStack>
        </VStack>
        <CustomButton
          title="Home"
          width="80%"
          tintColor="moccasin"
          color="tomato"
          onPress={() => navigation.navigate('home')}
        />
      </Box>
    </Box>
  );
};

export default Profile;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'moccasin'},
  page: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  data: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'peru',
    textAlign: 'center',
  },
});
