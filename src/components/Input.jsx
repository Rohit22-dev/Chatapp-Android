import {StyleSheet, Alert, TextInput, View} from 'react-native';
import {useState} from 'react';
import {IconButton} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from './CustomButton';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {v4 as uuid} from 'uuid';
import {useSelector} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const Input = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [click, setClick] = useState(true);

  const {currentUser, chatUser, chatId} = useSelector(state => ({
    currentUser: state.counter.user,
    chatUser: state.counter.chatUser,
    chatId: state.counter.chatId,
  }));

  const handleSend = async () => {
    setClick(false);
    if (image) {
      const id = uuid();
      console.log(id);
      const storageRef = storage().ref(id);

      const uploadTask = storageRef.putFile(image.assets[0].uri);
      console.log('object', uploadTask);

      uploadTask.on('state_changed', async () => {
        const downloadURL = await storageRef.getDownloadURL();
        console.log(downloadURL);

        await firestore()
          .collection('chats')
          .doc(chatId)
          .update({
            messages: firestore.FieldValue.arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: firestore.Timestamp.now(),
              img: downloadURL,
            }),
          });
      });
    } else {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .update({
          messages: firestore.FieldValue.arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: firestore.Timestamp.now(),
          }),
        });
    }

    const docRef = firestore().collection('userChats');

    await docRef.doc(currentUser.uid).update({
      [chatId + '.lastMessage']: {
        text,
      },
      [chatId + '.date']: firestore.FieldValue.serverTimestamp(),
    });

    await docRef.doc(chatUser.uid).update({
      [chatId + '.lastMessage']: {
        text,
      },
      [chatId + '.date']: firestore.FieldValue.serverTimestamp(),
    });

    setText('');
    setImage(null);
    setClick(true);
  };

  const getImage = async (camera = false) => {
    const options = {
      storageOptions: {
        path: 'images',
        mediatype: 'photo',
      },
      // includeBase64: true,
      cameraType: 'front',
      quality: 1,
    };

    const result = await (camera
      ? launchCamera(options)
      : launchImageLibrary());
    console.log(result);
    setImage(result);
    handleSend();
  };

  return (
    <View style={styles.root}>
      <TextInput
        placeholder="Text input..."
        style={{flex: 1}}
        value={text}
        onChangeText={text => setText(text)}
      />
      <IconButton
        icon={props => <Icon name="add-a-photo" {...props} />}
        color="tomato"
        onPress={() => getImage(true)}
      />
      <IconButton
        icon={props => <Icon name="add-photo-alternate" {...props} />}
        color="tomato"
        onPress={() => getImage()}
      />
      {click && (
        <CustomButton
          title="Send"
          width="auto"
          color="tomato"
          uppercase={false}
          padding={0}
          marginTop={0}
          onPress={handleSend}
        />
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    display: 'flex',
    backgroundColor: 'beige',
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
});
