import React from 'react';
import { View } from 'react-native';
import { Field } from 'redux-form';
import styles from './styles';
import {
    InputField,
    CtButton,
    DefaultLayout,
    SelectPickerField,
    Editor,
    PLACEHOLDER_TYPES as TYPES
} from '@/components';
import { goBack, MOUNT, UNMOUNT } from '@/navigation';
import Lng from '@/lang/i18n';
import { alertMe, BUTTON_COLOR } from '@/constants';
import {
    NOTES_EDIT,
    NOTES_FIELD_MODAL_TYPES as MODAL_TYPES,
    NOTES_ADD
} from '../../constants';

interface IProps {
    navigation: any;
    type: any;
    createNote: Function;
    updateNote: Function;
    getNotesLoading: Boolean;
    removeNote: Function;
    locale: any;
    noteId: Number;
    noteLoading: any;
    handleSubmit: Function;
    dispatch: Function;
    formValues: any;
    getNoteDetail: Function;
    getCreateNote: Function;
    customFields: Array<any>;
}

export default class Note extends React.Component<IProps> {
    constructor(props) {
        super(props);
        this.state = { isLoading: true };
    }

    componentDidMount() {
        const { navigation } = this.props;
        goBack(MOUNT, navigation);
        this.getCustomFields();
    }

    componentWillUnmount() {
        goBack(UNMOUNT);
    }

    getCustomFields = () => {
        const { type, getCreateNote, getNoteDetail } = this.props;

        if (type === NOTES_ADD) {
            getCreateNote({
                onSuccess: () => this.setState({ isLoading: false })
            });
            return;
        }

        if (type === NOTES_EDIT) {
            getNoteDetail({
                onSuccess: () => this.setState({ isLoading: false })
            });
            return;
        }
    };

    onSubmitNote = note => {
        const { type, createNote, updateNote, navigation } = this.props;

        if (this.state.isLoading) {
            return;
        }

        const params = {
            params: note,
            onSuccess: () => {
                navigation.goBack(null);
            },
            navigation
        };

        type === NOTES_ADD ? createNote(params) : updateNote(params);
    };

    removeNote = () => {
        const { removeNote, navigation, locale, noteId } = this.props;

        alertMe({
            title: Lng.t('alert.title', { locale }),
            desc: Lng.t('notes.alertDescription', { locale }),
            showCancel: true,
            okPress: () =>
                removeNote({
                    id: noteId,
                    navigation,
                    onFail: () => {
                        alertMe({
                            title: `${name} ${Lng.t('notes.alreadyUsed', {
                                locale
                            })}`
                        });
                    },
                    onResult: () => {
                        navigation.goBack(null);
                    }
                })
        });
    };

    BOTTOM_ACTION = handleSubmit => {
        const { locale, type, noteLoading } = this.props;

        return (
            <View
                style={[
                    styles.submitButton,
                    type === NOTES_EDIT && styles.multipleButton
                ]}
            >
                <CtButton
                    onPress={handleSubmit(this.onSubmitNote)}
                    btnTitle={Lng.t('button.save', { locale })}
                    buttonContainerStyle={type === NOTES_EDIT && styles.flex}
                    containerStyle={styles.btnContainerStyle}
                    loading={noteLoading}
                />

                {type === NOTES_EDIT && (
                    <CtButton
                        onPress={this.removeNote}
                        btnTitle={Lng.t('button.remove', { locale })}
                        buttonColor={BUTTON_COLOR.DANGER}
                        containerStyle={styles.btnContainerStyle}
                        buttonContainerStyle={styles.flex}
                        loading={noteLoading}
                    />
                )}
            </View>
        );
    };

    render() {
        const {
            navigation,
            handleSubmit,
            locale,
            type,
            noteDetail
        } = this.props;
        const { isLoading } = this.state;
        const isEditScreen = type === NOTES_EDIT;
        const types = isEditScreen
            ? [TYPES.PREDEFINE_CUSTOMER, TYPES.CUSTOMER, noteDetail?.type]
            : [TYPES.PREDEFINE_CUSTOMER, TYPES.CUSTOMER];

        return (
            <DefaultLayout
                headerProps={{
                    leftIconPress: () => {
                        navigation.goBack(null);
                    },
                    title: isEditScreen
                        ? Lng.t('header.editNote', { locale })
                        : Lng.t('header.addNote', { locale }),
                    placement: 'center',
                    rightIcon: 'save',
                    rightIconProps: {
                        solid: true
                    },
                    rightIconPress: handleSubmit(this.onSubmitNote)
                }}
                bottomAction={this.BOTTOM_ACTION(handleSubmit)}
                loadingProps={{
                    is: isLoading
                }}
            >
                <View style={styles.bodyContainer}>
                    <Field
                        name="name"
                        component={InputField}
                        isRequired
                        hint={Lng.t('notes.title', { locale })}
                        inputFieldStyle={styles.inputFieldStyle}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true,
                            autoFocus: true
                        }}
                        validationStyle={styles.inputFieldValidation}
                    />

                    <Field
                        name="type"
                        component={SelectPickerField}
                        label={Lng.t('notes.type', {
                            locale
                        })}
                        fieldIcon="align-center"
                        items={MODAL_TYPES}
                        defaultPickerOptions={{
                            label: Lng.t('notes.modelPlaceholder', {
                                locale
                            }),
                            value: ''
                        }}
                        isRequired
                    />
                    <Editor
                        {...this.props}
                        types={types}
                        name="notes"
                        label="notes.description"
                        isRequired
                    />
                </View>
            </DefaultLayout>
        );
    }
}
