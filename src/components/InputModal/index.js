import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles';
import { AnimateModal } from '../AnimateModal';
import { Field } from 'redux-form';
import { InputField } from '../InputField';
import { ActionButton, CtDecorativeButton } from '../Button';
import { Icon } from 'react-native-elements';
import { Text } from '../Text';

type Iprops = {
    modalProps?: Object,
    headerTitle?: String,
    hint?: String,
    fieldName?: String,
    onRemove?: Function,
    onSubmit?: Function,
    showRemoveButton?: Boolean,
    reference?: any,
    onSubmitLoading?: Boolean
};

class inputModalComponent extends Component<Iprops> {
    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    componentDidMount() {
        this.props.reference?.(this);
    }

    componentWillUnmount() {
        this.props.reference?.(undefined);
    }

    onToggle = () => {
        this.setState(({ visible }) => {
            return { visible: !visible };
        });
    };

    BUTTON_VIEW = () => {
        const {
            showRemoveButton = false,
            showSaveButton = true,
            onSubmitLoading = false,
            onRemoveLoading = false,
            onRemove,
            onSubmit
        } = this.props;

        if (!showRemoveButton && !showSaveButton) {
            return null;
        }

        const bottomAction = [
            {
                label: 'button.cancel',
                onPress: this.onToggle,
                type: 'btn-outline',
                show: !showRemoveButton,
                loading: onSubmitLoading
            },
            {
                label: 'button.remove',
                onPress: () => onRemove?.(),
                bgColor: 'btn-danger',
                show: showRemoveButton,
                loading: onRemoveLoading
            },
            {
                label: 'button.save',
                onPress: () => onSubmit?.(),
                show: showSaveButton,
                loading: onSubmitLoading
            }
        ];

        return <ActionButton buttons={bottomAction} hide-container-style />;
    };

    FIELD = () => {
        const { fieldName, hint, disabled } = this.props;

        return (
            <View style={styles.fieldView}>
                <Field
                    name={fieldName}
                    component={InputField}
                    hint={hint}
                    disabled={disabled}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCorrect: true
                    }}
                    isRequired
                />
            </View>
        );
    };

    HEADER_VIEW = () => {
        const { headerTitle, theme } = this.props;

        return (
            <View style={styles.rowViewContainer(theme)}>
                <View style={styles.rowView}>
                    <Text color={theme.input.color} style={styles.heading}>
                        {headerTitle}
                    </Text>
                </View>
                <View>
                    <CtDecorativeButton onPress={this.onToggle} withHitSlop>
                        <Icon
                            name="close"
                            size={28}
                            color={theme.listItem.fifth.color}
                        />
                    </CtDecorativeButton>
                </View>
            </View>
        );
    };

    render() {
        const { modalProps, onSubmitLoading, onRemoveLoading } = this.props;
        return (
            <AnimateModal
                visible={this.state.visible}
                onToggle={this.onToggle}
                modalProps={{
                    animationInTiming: 1,
                    animationOutTiming: 1,
                    onSwipeComplete: this.onToggle,
                    ...(!onSubmitLoading &&
                        !onRemoveLoading && { swipeDirection: 'right' }),
                    ...modalProps
                }}
            >
                <KeyboardAvoidingView
                    keyboardVerticalOffset={0}
                    behavior="position"
                >
                    <ScrollView
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View
                            style={styles.modalViewContainer(this.props.theme)}
                        >
                            {this.HEADER_VIEW()}

                            {this.FIELD()}

                            {this.BUTTON_VIEW()}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </AnimateModal>
        );
    }
}

export const InputModal = connect(
    ({ global }) => ({
        theme: global?.theme,
        locale: global?.locale
    }),
    {}
)(inputModalComponent);
