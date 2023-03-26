import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import ChatBubble from './ChatBubble';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const chatId = useSelector(state => state.counter.chatId);

  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(chatId)
      .onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          const messages = data.messages;
          setMessages(messages);
          // do something with the messages array
        }
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [chatId]);
  console.log(messages);

  return (
    <View style={{flex: 1, backgroundColor: 'whitesmoke', padding: 5}}>
      <FlatList
        data={messages}
        renderItem={item => <ChatBubble message={item} />}
      />
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({});
