import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import ChatBubble from '../components/ChatBubble';
import Input from '../components/Input';
import Navbar from '../components/Navbar';
import Chat from './Chat';
import Contacts from './Contacts';

const Tab = createMaterialTopTabNavigator();

const Home = () => {
  const user = useSelector(state => state.counter.user);
  const image = user?.photoURL;
  return (
    <View style={styles.root}>
      <Navbar image={image} />
      {/* <Input /> */}
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {fontSize: 13},
          tabBarItemStyle: {},
          tabBarStyle: {
            backgroundColor: 'beige',
          },
          lazy: true,
        }}>
        <Tab.Screen name="contact" component={Contacts} />
        <Tab.Screen name="chat" component={Chat} />
      </Tab.Navigator>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'moccasin'},
});
