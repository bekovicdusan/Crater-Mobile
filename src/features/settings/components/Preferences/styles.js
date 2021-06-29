import { StyleSheet } from 'react-native';
import { colors } from '@/styles';

export default styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 20,
        marginBottom: 10
    },
    selectedField: {
        paddingLeft: 47
    },
    dividerLine: {
        marginTop: 18,
        marginBottom: 18,
        backgroundColor: colors.gray,
        borderColor: colors.lightGray,
        borderWidth: 0.2
    }
});
