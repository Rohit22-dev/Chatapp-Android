import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import Signin from './screens/Signin';
import Signup from './screens/Signup';
import Profile from './screens/Profile';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {setUser} from './store/AuthSlice';

const Stack = createNativeStackNavigator();

export default function Entry() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.counter.user);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch(
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
          }),
        );
      } else {
        dispatch(setUser(null));
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'home' : 'signin'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="signin" component={Signin} />
        <Stack.Screen name="home" component={Home} />

        <Stack.Screen name="signup" component={Signup} />
        <Stack.Screen name="profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
