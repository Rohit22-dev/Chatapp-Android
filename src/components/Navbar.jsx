import {StyleSheet, TouchableOpacity, View, Alert} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {
  AppBar,
  Avatar,
  Flex,
  HStack,
  IconButton,
} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';
import Input from '../components/Input';
import {useSelector} from 'react-redux';

const Navbar = ({image}) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.counter.user);

  const handleSignOut = async () => {
    await auth().signOut();
    Alert.alert('Log out', 'Logout successfully');
    console.log('Signed out');
    navigation.navigate('signin');
  };

  return (
    <View style={styles.root}>
      <IconButton
        icon={props => <Icon name="log-in-outline" {...props} />}
        onPress={() => handleSignOut()}
      />
      <HStack>
        <TouchableOpacity onPress={() => navigation.navigate('profile')}>
          <Avatar image={{uri: image}} size={45} />
        </TouchableOpacity>
      </HStack>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'tomato',
  },
});
