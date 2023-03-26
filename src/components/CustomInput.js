import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
  hideButton = false,
}) => {
  const [pswHidden, setPswHidden] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View
            style={[
              styles.container,
              {borderColor: error ? 'red' : '#e8e8e8'},
            ]}>
            <TextInput
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor="#0008"
              secureTextEntry={pswHidden ? false : secureTextEntry}
            />
            {hideButton &&
              (pswHidden ? (
                <Icon
                  name="eye"
                  size={24}
                  color="#333"
                  onPress={() => setPswHidden(!pswHidden)}
                />
              ) : (
                <Icon
                  name="eye-off"
                  size={24}
                  color="#333"
                  onPress={() => setPswHidden(!pswHidden)}
                />
              ))}
          </View>
          {error && (
            <Text style={{color: 'red', alignSelf: 'stretch'}}>
              {error.message || 'Error'}
            </Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: 44,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',

    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    color: 'black',
  },
});

export default CustomInput;
