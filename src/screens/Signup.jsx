import {View, StyleSheet, Text, ScrollView, Alert, Image} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import storage from '@react-native-firebase/storage';
import {useDispatch} from 'react-redux';
import {setUser} from '../store/AuthSlice';
import {Box, Avatar} from '@react-native-material/core';
import firestore from '@react-native-firebase/firestore';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SignUpScreen = () => {
  const {control, handleSubmit, watch} = useForm();
  const [registering, setRegistering] = useState(false);
  const [image, setImage] = useState('');
  const pwd = watch('password');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onRegisterPressed = async data => {
    const {firstname, password, email, lastname} = data;
    const displayName = firstname + ' ' + lastname;
    console.log(data);
    if (registering) {
      return;
    }
    setRegistering(true);
    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = response.user._user;
      console.log(response);
      const reference = storage().ref(displayName);
      const pathToFile = image.assets[0].uri;
      // uploads file
      await reference.putFile(pathToFile);
      const url = await reference.getDownloadURL();
      const update = {
        displayName: displayName,
        photoURL: url,
      };

      await auth().currentUser.updateProfile(update);
      console.log('response', user);
      const User = auth().currentUser._user;
      await firestore().collection('users').doc(User.uid).set({
        uid: User.uid,
        displayName,
        email,
        photoURL: url,
      });

      await firestore().collection('userChats').doc(User.uid).set({});
      dispatch(setUser(User));
      navigation.navigate('home');
    } catch (e) {
      Alert.alert('Oops', e.message);
      console.log(e);
    }
    setRegistering(false);
    // navigation.navigate('ConfirmEmail');
  };
  const onTermsOfUsePressed = () => {
    console.warn('On terms of use pressed');
  };
  const onPrivacyPressed = () => {
    console.warn('On privacy pressed');
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
    Alert.alert('Image', 'Image uploaded successfully');
    setImage(result);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>
        <View>
          <Image
            style={{
              width: 150,
              height: 150,
              borderRadius: 20,
            }}
            resizeMode="cover"
            source={
              image === ''
                ? require('../assets/panda_3.png')
                : {uri: image.assets[0].uri}
            }
          />
        </View>

        <CustomInput
          name="firstname"
          placeholder="Firstname"
          control={control}
          rules={{
            required: 'Firstname is required',
            minLength: {
              value: '3',
              message: 'Firstname should be at least 3 characters long',
            },
            maxLength: {
              value: '24',
              message: 'Firstname should be at most 24 characters long',
            },
          }}
        />

        <CustomInput
          name="lastname"
          placeholder="Lastname"
          control={control}
          rules={{
            required: 'Lastname is required',
            minLength: {
              value: '3',
              message: 'Lastname should be at least 3 characters long',
            },
            maxLength: {
              value: '24',
              message: 'Lastname should be at most 24 characters long',
            },
          }}
        />
        <CustomInput
          name="email"
          placeholder="Email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {value: EMAIL_REGEX, message: 'Email is invalid'},
          }}
        />
        <CustomInput
          name="password"
          placeholder="Password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: '4',
              message: 'Password should be at least 3 characters long',
            },
          }}
          secureTextEntry
          hideButton
        />
        <CustomInput
          name="repeat-password"
          placeholder="Repeat Password"
          control={control}
          rules={{validate: value => value === pwd || 'Password do not match'}}
          secureTextEntry
          hideButton
        />

        <Box
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
            marginVertical: 10,
          }}>
          <Avatar
            icon={props => (
              <Icon
                name="add-a-photo"
                onPress={() => getImage(true)}
                {...props}
              />
            )}
            color="moccasin"
            tintColor="#555"
            size={90}
            style={{elevation: 8}}
          />
          <Avatar
            icon={props => (
              <Icon
                name="add-photo-alternate"
                {...props}
                onPress={() => getImage()}
              />
            )}
            color="tomato"
            tintColor="#eee"
            size={90}
            style={{elevation: 8}}
          />
        </Box>
        <CustomButton
          title={registering ? 'Registering...' : 'Register'}
          onPress={handleSubmit(onRegisterPressed)}
        />

        {/* <CustomButton
          text="Upload profile image"
          type="SECONDARY"
          required
          // bgColor="cyan"
          onPress={() => selectDoc()}
        />
        <CustomButton text="Launch camera" onPress={() => camera()} /> */}

        <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy.
          </Text>
        </Text>

        <CustomButton
          title="Have an account? Sign in"
          onPress={() => navigation.navigate('signin')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    margin: 10,
  },
  text: {
    color: 'grey',
    marginVertical: 10,
  },
  link: {
    color: '#fdb075',
  },
  imageUpload: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: '#3871f3',
    borderWidth: 2,
    backgroundColor: 'white',
  },
});

export default SignUpScreen;
