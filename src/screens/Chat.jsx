import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Input from '../components/Input';
import {Avatar, Flex, Spacer} from '@react-native-material/core';
import {useSelector} from 'react-redux';
import Messages from '../components/Messages';

const Chat = () => {
  const ChatUser = useSelector(state => state.counter.chatUser);
  // console.log(ChatUser);
  return (
    <View style={styles.root}>
      <Flex
        inline={true}
        center={true}
        ph={20}
        pv={5}
        style={{backgroundColor: '#ddd'}}>
        <Text style={{fontSize: 18}}>{ChatUser?.displayName}</Text>
        <Spacer />
        <Avatar image={{uri: ChatUser?.photoURL}} size={35} />
      </Flex>
      <Messages />
      <Input />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({root: {flex: 1}});
