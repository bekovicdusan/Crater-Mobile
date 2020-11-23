import { isIPhoneX } from '@/constants';
import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
    listViewContainer: {
        paddingBottom: isIPhoneX() ? 30 : 0,
        flex: 0.99
    },
    bodyContainer: {
        paddingHorizontal: 22,
        paddingVertical: 17
    },
    modalContainer: {
        flex: 1,
        ...Platform.select({
            android: {
                marginTop: -20,
                margin: 0,
                padding: 0
            }
        })
    }
});
