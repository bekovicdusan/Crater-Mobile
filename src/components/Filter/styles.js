import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
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
    },
    backIcon: {
        color: colors.dark
    },
    submitHint: {
        fontSize: 17,
        textAlign: 'left'
    },
    submitButton: {
        flexDirection: 'row'
        // justifyContent: "space-between",
    },
    handleBtn: {
        marginHorizontal: 9
    },
    buttonContainer: {
        flex: 1
    },
    inputIconStyle: {
        marginLeft: 5
    },
    counter: (theme, isSmall) => ({
        position: 'absolute',
        top: -9,
        right: -11,
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        backgroundColor: theme?.icons?.filter?.color,
        borderWidth: 1.5,
        borderColor: theme?.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        ...(isSmall && {
            top: -9,
            right: 1,
            width: 18,
            height: 18,
            borderRadius: 18 / 2
        })
    }),
    counterText: isSmall => ({
        fontSize: 12,
        ...(isSmall && {
            fontSize: 11
        })
    })
});
