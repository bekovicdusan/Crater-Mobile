import { isIPhoneX, SCREEN_HEIGHT } from '@/constants';
import { colors, fonts } from '@/styles';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Modal
    modalViewContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.veryLightGray,
        paddingBottom: isIPhoneX() ? 25 : 5,
        maxHeight: SCREEN_HEIGHT - 50
    },

    body: {
        flex: 1,
        paddingHorizontal: isIPhoneX() ? 22 : 20
    },
    items: {
        paddingVertical: isIPhoneX() ? 10 : 5,
        flexDirection: 'row'
    },
    item: {
        paddingBottom: 1,
        paddingRight: 15,
        flexDirection: 'row'
    },
    itemText: {
        fontSize: 15,
        fontFamily: fonts.poppinsMedium,
        paddingVertical: 6,
        color: colors.darkGray2,
        marginLeft: 6
    },

    labelView: {
        marginTop: 10,
        marginBottom: 10,
        width: '100%'
    },
    label: {
        fontSize: 15,
        color: colors.darkGray,
        fontFamily: fonts.poppinsMedium
    },
    arrowIcon: {
        justifyContent: 'center'
    },

    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: -10,
        alignItems: 'center'
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    hint: {
        color: colors.dark2,
        fontSize: 14,
        paddingLeft: 4,
        fontFamily: fonts.poppins
    },
    insertFields: {
        color: colors.primary,
        fontFamily: fonts.poppins,
        fontSize: 14,
        textAlign: 'left',
        paddingHorizontal: 5
    },
    required: {
        color: colors.danger
    },
    pencilIconView: {
        justifyContent: 'center',
        paddingRight: 5
    },
    eyeIconView: {
        paddingLeft: 10,
        paddingRight: 5
    },
    htmlView: {
        marginTop: 17,
        marginHorizontal: 0,
        minHeight: 152,
        borderWidth: 0.5,
        borderColor: colors.gray2,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        paddingVertical: 7
    },
    error: {
        borderColor: colors.danger
    },
    validation: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 2,
        overflow: 'hidden',
        flex: 1,
        zIndex: 100,
        backgroundColor: colors.danger
    }
});

export default styles;
