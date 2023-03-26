import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useDispatch} from 'react-redux';
import {setUser} from '../store/AuthSlice';
import {useForm} from 'react-hook-form';
import {Button} from '@react-native-material/core';

const Signin = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  GoogleSignin.configure({
    webClientId:
      '320343470793-5fa7k9g466apgbh50tc388bu6k3n0973.apps.googleusercontent.com',
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const res = await GoogleSignin.signIn();
      navigation.navigate('home');
      console.log(res);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const handleSignIn = async data => {
    try {
      setLoad(true);
      const {email, password} = data;
      const res = await auth().signInWithEmailAndPassword(email, password);
      dispatch(setUser(res.user._user));
      navigation.navigate('home');
      setLoad(false);
    } catch (error) {
      setLoad(false);
      console.error(error.code.slice(5));
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={[styles.root, {height: height}]}>
        <Text style={{fontSize: 28, fontWeight: 500, color: 'black'}}>
          Hello there
        </Text>
        <Text style={{fontSize: 14, color: '#333'}}>Welcome back</Text>
        <Image
          style={{
            width: 180,
            height: 180,
          }}
          source={require('../assets/panda.png')}
        />
        <CustomInput
          name="email"
          placeholder="Email"
          control={control}
          rules={{required: 'Emailvamp@wolfecsd is required'}}
        />

        <CustomInput
          name="password"
          placeholder="Password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: '4',
              message: 'Password should be minimum 4 characters long',
            },
          }}
          secureTextEntry
          hideButton
        />

        <CustomButton
          title={!load && 'Sign In'}
          loading={load ? true : false}
          onPress={handleSubmit(handleSignIn)}
        />

        <CustomButton title="Forgot Password" color="white" />

        <GoogleSigninButton
          style={{width: '100%', height: 60, marginTop: 10}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => handleGoogleSignIn()}
          // disabled={this.state.isSigninInProgress}
        />

        <CustomButton
          title="Don't have an account? Create one"
          onPress={load ? undefined : () => navigation.navigate('signup')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 20,
    // backgroundColor: 'orangereds',
  },
});

export default Signin;
