import {Avatar} from '@react-native-material/core';
import {useRef} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';

const ChatBubble = ({message}) => {
  const time = t => {
    const date = new Date(t * 1000);

    const localTime = date.toLocaleTimeString();
    return localTime;
  };
  const {currentUser, currentChatUser} = useSelector(state => ({
    currentUser: state.counter.user,
    currentChatUser: state.counter.chatUser,
  }));
  const ref = useRef();

  const isMe = message.item.senderId === currentUser?.uid;

  return (
    <View
      ref={ref}
      style={
        ([styles.root],
        isMe ? {justifyContent: 'flex-end'} : {justifyContent: 'flex-start'})
      }>
      <Avatar
        image={{uri: isMe ? currentUser.photoURL : currentChatUser.photoURL}}
        size={20}
        style={isMe ? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'}}
      />
      <View style={[styles.chatBubble, isMe ? styles.me : styles.other]}>
        {message.item.text && (
          <Text style={styles.messageText}>{message.item.text}</Text>
        )}
        {message.item.img && (
          <Image
            style={{
              width: 180,
              height: 180,
            }}
            source={{uri: message.item.img}}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatBubble: {
    borderRadius: 20,
    margin: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    maxWidth: '80%',
  },
  me: {
    alignSelf: 'flex-end',
    backgroundColor: 'firebrick',
    borderBottomRightRadius: 0,
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: 'saddlebrown',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'flex-end',
  },
});

export default ChatBubble;
