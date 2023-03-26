import {Text, Pressable} from 'react-native';
import React from 'react';
import {Avatar, Box, HStack, VStack} from '@react-native-material/core';

const FriendsChatBox = ({user, onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <Box p={10} m={10} style={{backgroundColor: '#ddd', borderRadius: 10}}>
        <HStack spacing={10}>
          <Avatar image={{uri: user.photoURL}} />
          <VStack>
            <Text style={{fontSize: 16, color: 'black'}}>
              {user.displayName}
            </Text>
            <Text>{user.uid}</Text>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
};

export default FriendsChatBox;
