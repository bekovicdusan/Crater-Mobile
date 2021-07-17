import {StyleSheet} from 'react-native';
import {colors, fonts} from '@/styles';

export const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    marginVertical: -2
  },
  label: theme => ({
    fontWeight: 'normal',
    fontFamily: fonts.poppins,
    fontSize: 15,
    marginLeft: 5,
    color: theme.text.secondaryColor,
    textAlign: 'left'
  })
});
