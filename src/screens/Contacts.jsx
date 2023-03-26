import {
  IconButton,
  TextInput,
  Pressable,
  Divider,
} from '@react-native-material/core';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {setChatUser} from '../store/AuthSlice';
import FriendsChatBox from '../components/FriendsChatBox';

const Contacts = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState(null);
  const [err, setErr] = useState(false);
  const currentUser = useSelector(state => state.counter.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    firestore()
      .collection('userChats')
      .doc(currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setFriends(Object.entries(documentSnapshot.data()));
        }
      });
  }, []);

  const handleSearch = async () => {
    const fire = firestore().collection('users');
    console.log(currentUser);
    const q = fire.where('displayName', '==', username);

    try {
      const querySnapshot = await q.get();
      querySnapshot.forEach(doc => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  };

  const handleSelect = async () => {
    dispatch(setChatUser(user));
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    const docRef = firestore().collection('chats').doc(combinedId);

    try {
      const res = await docRef.get();

      if (!res.exists) {
        //create a chat in chats collection
        await docRef.set({messages: []});

        //create user chats
        await firestore()
          .collection('userChats')
          .doc(currentUser.uid)
          .update({
            [combinedId + '.userInfo']: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [combinedId + '.date']: firestore.FieldValue.serverTimestamp(),
          });

        await firestore()
          .collection('userChats')
          .doc(user.uid)
          .update({
            [combinedId + '.userInfo']: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [combinedId + '.date']: firestore.FieldValue.serverTimestamp(),
          });
      }
      navigation.navigate('chat');
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    setUsername('');
  };

  const handleFriendClick = u => {
    dispatch(setChatUser(u));
    navigation.navigate('chat');
  };

  return (
    <View style={styles.root}>
      <Pressable style={{width: '100%', alignItems: 'center'}}>
        <TextInput
          placeholder="Find user..."
          color="#555"
          style={{width: '90%', marginTop: 10}}
          onChangeText={newText => setUsername(newText)}
          trailing={
            <IconButton
              icon={props => <Icon name="search" {...props} />}
              onPress={() => handleSearch()}
            />
          }
        />
      </Pressable>

      {err && <Text>User not found</Text>}

      {user && <FriendsChatBox user={user} onPress={() => handleSelect()} />}

      {friends && (
        <FlatList
          data={friends}
          ItemSeparatorComponent={
            <Divider style={{height: 2}} inset={14} color="#ddd" />
          }
          renderItem={({item}) => (
            <FriendsChatBox
              user={item[1].userInfo}
              onPress={() => handleFriendClick(item[1].userInfo)}
            />
          )}
          keyExtractor={item => item[1].userInfo.uid}
        />
      )}
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  root: {flex: 1},
  search: {
    width: '90%',
    borderBottomWidth: 1,
    borderColor: '#666',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
});
