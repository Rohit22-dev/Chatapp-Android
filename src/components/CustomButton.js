import {Button} from '@react-native-material/core';

const CustomButton = ({
  title,
  loading = false,
  color = '#3871f3',
  tintColor = '#333',
  width = '100%',
  padding = 8,
  onPress,
  marginTop = 10,
}) => {
  return (
    <Button
      title={title}
      loading={loading}
      color={color}
      tintColor={tintColor}
      uppercase={false}
      width={width}
      padding={padding}
      marginTop={marginTop}
      loadingIndicatorPosition="trailing"
      onPress={onPress}
      // onPress={handleSubmit(handleSignIn)}
    />
  );
};

export default CustomButton;
