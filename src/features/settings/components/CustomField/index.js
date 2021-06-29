// @flow

import React from 'react';
import { View } from 'react-native';
import { Field, change } from 'redux-form';
import {
    alertMe,
    hasObjectLength,
    hasLength,
    hasFieldValue,
    hasValue,
    KEYBOARD_TYPE
} from '@/constants';
import Lng from '@/lang/i18n';
import { goBack, MOUNT, UNMOUNT } from '@/navigation';
import {
    InputField,
    DefaultLayout,
    ToggleSwitch,
    SelectPickerField,
    Text,
    ActionButton
} from '@/components';
import {
    setCustomFieldRefs,
    DEFAULT_INPUT_FIELD,
    DEFAULT_NUMBER_FIELD,
    DEFAULT_DATE_FIELD,
    DEFAULT_TIME_FIELD,
    PLACEHOLDER_FIELD,
    DEFAULT_TEXTAREA_FIELD,
    SELECT_FIELD_OPTIONS,
    SELECT_FIELD_DEFAULT_VALUE,
    DEFAULT_CHECKBOX_FIELD,
    DEFAULT_DATE_TIME_FIELD
} from './options';
import {
    EDIT_CUSTOM_FIELD_TYPE,
    CREATE_CUSTOM_FIELD_TYPE,
    CUSTOM_FIELD_FORM,
    CUSTOM_FIELDS as FIELDS,
    DATA_TYPE_OPTION_VALUE as OPTION_VALUE,
    CUSTOM_FIELD_MODAL_TYPES as MODAL_TYPES,
    CUSTOM_FIELD_DATA_TYPE_LIST as DATA_TYPES
} from '../../constants';
import styles from './styles';

type IProps = {
    navigation: Object,
    formValues: Object,
    handleSubmit: Function,
    createCustomField: Function,
    editCustomField: Function,
    getCustomField: Function,
    removeCustomField: Function,
    locale: String,
    type: String,
    loading: boolean,
    id: Number,
    field: any,
    getCustomFieldLoading: boolean,
    removeCustomFieldLoading: boolean
};

export class CustomField extends React.Component<IProps> {
    constructor(props) {
        super(props);
        this.customFieldRefs = setCustomFieldRefs.bind(this);
        this.state = {};
    }

    componentDidMount() {
        const { navigation, type, dispatch, getCustomField, id } = this.props;
        goBack(MOUNT, navigation);

        if (type === EDIT_CUSTOM_FIELD_TYPE) {
            getCustomField({
                id,
                onResult: res => {
                    const field = {
                        ...res,
                        [FIELDS.DEFAULT_VALUE]:
                            res.defaultAnswer || res.default_answer
                    };
                    dispatch(change(CUSTOM_FIELD_FORM, FIELDS.FIELD, field));
                }
            });
        }
    }

    componentWillUnmount() {
        this.customFieldRefs(undefined);
        goBack(UNMOUNT);
    }

    setFormField = (field, value) => {
        const fieldName = `${FIELDS.FIELD}.${field}`;
        this.props.dispatch(change(CUSTOM_FIELD_FORM, fieldName, value));
    };

    getOptionsValue = options => {
        return options.filter(option => hasValue(option) && option !== '');
    };

    onSubmit = ({ field }) => {
        const {
            id,
            type,
            createCustomField,
            editCustomField,
            navigation,
            loading,
            formValues,
            getCustomFieldLoading,
            removeCustomFieldLoading
        } = this.props;

        if (
            !loading &&
            !getCustomFieldLoading &&
            !removeCustomFieldLoading &&
            formValues
        ) {
            const options = hasFieldValue(field[FIELDS.OPTIONS])
                ? this.getOptionsValue(field[FIELDS.OPTIONS])
                : [];
            const params = { ...field, [FIELDS.OPTIONS]: options };

            if (type === CREATE_CUSTOM_FIELD_TYPE)
                createCustomField({ params, navigation });
            else {
                editCustomField({ id, params, navigation });
            }
        }
    };

    removeField = () => {
        const { removeCustomField, navigation, locale, id } = this.props;

        alertMe({
            title: Lng.t('alert.title', { locale }),
            desc: Lng.t('customFields.removeAlertDescription', {
                locale
            }),
            showCancel: true,
            okPress: () => removeCustomField({ id, navigation })
        });
    };

    onChangeReset = () => {
        this.setFormField(FIELDS.DEFAULT_VALUE, '');
        this.setFormField(FIELDS.PLACEHOLDER, '');
        this.setFormField(FIELDS.OPTIONS, []);
    };

    REQUIRE_FIELD_VIEW = () => {
        const { locale, theme } = this.props;
        return (
            <View style={[styles.row, { marginTop: 10 }]}>
                <View style={styles.positionView}>
                    <Text
                        h4
                        color={theme?.viewLabel?.secondaryColor}
                        medium={theme?.mode === 'dark'}
                        style={{ marginLeft: 3 }}
                    >
                        {Lng.t('customFields.required', {
                            locale
                        })}
                    </Text>
                </View>

                <View style={styles.column}>
                    <Field
                        name={`${FIELDS.FIELD}.${FIELDS.IS_REQUIRED}`}
                        component={ToggleSwitch}
                        switchStyle={{ marginRight: 100 }}
                        hintStyle={styles.leftText}
                    />
                </View>
            </View>
        );
    };

    DISPLAY_PORTAL_TOGGLE_VIEW = () => {
        const { locale } = this.props;
        return (
            <View style={styles.row}>
                <View style={styles.positionView}>
                    <Text secondary h4 style={{ marginLeft: 3 }}>
                        {Lng.t('customFields.displayInPortal', {
                            locale
                        })}
                    </Text>
                </View>

                <View style={styles.column}>
                    <Field
                        name={`${FIELDS.FIELD}.${FIELDS.DISPLAY_PORTAL}`}
                        component={ToggleSwitch}
                        hint={Lng.t('customFields.no', {
                            locale
                        })}
                        hintStyle={styles.leftText}
                    />
                </View>

                <View style={styles.columnRight}>
                    <Text secondary h4 style={{ marginLeft: 3 }}>
                        {Lng.t('customFields.yes', { locale })}
                    </Text>
                </View>
            </View>
        );
    };

    DATA_TYPE_OPTION_BASE_VIEW = () => {
        const { formValues } = this.props;
        let dataType = formValues?.[FIELDS.FIELD]?.[FIELDS.TYPE];
        let optionView = [];

        switch (dataType) {
            case OPTION_VALUE.INPUT:
                optionView = [DEFAULT_INPUT_FIELD(), PLACEHOLDER_FIELD()];
                break;

            case OPTION_VALUE.TEXTAREA:
                optionView = [DEFAULT_TEXTAREA_FIELD(), PLACEHOLDER_FIELD()];
                break;

            case OPTION_VALUE.PHONE:
                optionView = [DEFAULT_INPUT_FIELD(), PLACEHOLDER_FIELD()];
                break;

            case OPTION_VALUE.URL:
                optionView = [DEFAULT_INPUT_FIELD(), PLACEHOLDER_FIELD()];
                break;

            case OPTION_VALUE.NUMBER:
                optionView = [DEFAULT_NUMBER_FIELD(), PLACEHOLDER_FIELD()];
                break;

            case OPTION_VALUE.DROPDOWN:
                optionView = [
                    SELECT_FIELD_OPTIONS(),
                    SELECT_FIELD_DEFAULT_VALUE(),
                    PLACEHOLDER_FIELD()
                ];
                break;

            case OPTION_VALUE.SWITCH:
                optionView = [DEFAULT_CHECKBOX_FIELD()];
                break;

            case OPTION_VALUE.DATE:
                optionView = [DEFAULT_DATE_FIELD(), PLACEHOLDER_FIELD()];
                break;

            case OPTION_VALUE.TIME:
                optionView = [DEFAULT_TIME_FIELD(), PLACEHOLDER_FIELD()];
                break;

            case OPTION_VALUE.DATE_TIME:
                optionView = [DEFAULT_DATE_TIME_FIELD(), PLACEHOLDER_FIELD()];

            default:
                break;
        }

        return !hasLength(optionView) ? <></> : optionView;
    };

    isLoading = () => {
        const { formValues, getCustomFieldLoading } = this.props;
        return (
            !formValues || !hasObjectLength(formValues) || getCustomFieldLoading
        );
    };

    render() {
        const {
            navigation,
            handleSubmit,
            locale,
            type,
            loading,
            removeCustomFieldLoading
        } = this.props;

        const bottomAction = [
            {
                label: 'button.save',
                onPress: handleSubmit(this.onSubmit),
                loading: loading || this.isLoading()
            },
            {
                label: 'button.remove',
                onPress: this.removeField,
                loading: removeCustomFieldLoading || this.isLoading(),
                bgColor: 'btn-danger',
                show: type === EDIT_CUSTOM_FIELD_TYPE
            }
        ];

        this.customFieldRefs(this);

        return (
            <DefaultLayout
                headerProps={{
                    leftIconPress: () => {
                        navigation.goBack(null);
                    },
                    title:
                        type === EDIT_CUSTOM_FIELD_TYPE
                            ? Lng.t('header.editCustomField', {
                                  locale
                              })
                            : Lng.t('header.addCustomField', {
                                  locale
                              }),
                    placement: 'center',
                    rightIcon: 'save',
                    rightIconProps: {
                        solid: true
                    },
                    rightIconPress: handleSubmit(this.onSubmit)
                }}
                bottomAction={
                    <ActionButton locale={locale} buttons={bottomAction} />
                }
                loadingProps={{ is: this.isLoading() }}
            >
                <View style={styles.bodyContainer}>
                    <Field
                        name={`${FIELDS.FIELD}.${FIELDS.NAME}`}
                        component={InputField}
                        isRequired
                        hint={Lng.t('customFields.name', {
                            locale
                        })}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true
                        }}
                    />

                    <Field
                        name={`${FIELDS.FIELD}.${FIELDS.MODAL_TYPE}`}
                        component={SelectPickerField}
                        label={Lng.t('customFields.model', {
                            locale
                        })}
                        fieldIcon="align-center"
                        items={MODAL_TYPES}
                        defaultPickerOptions={{
                            label: Lng.t('customFields.modelPlaceholder', {
                                locale
                            }),
                            value: ''
                        }}
                        isRequired
                    />

                    {this.REQUIRE_FIELD_VIEW()}

                    <Field
                        name={`${FIELDS.FIELD}.${FIELDS.TYPE}`}
                        label={Lng.t('customFields.type', {
                            locale
                        })}
                        component={SelectPickerField}
                        isRequired
                        fieldIcon="align-center"
                        items={DATA_TYPES}
                        defaultPickerOptions={{
                            label: Lng.t('customFields.typePlaceholder', {
                                locale
                            }),
                            value: ''
                        }}
                        onChangeCallback={() => this.onChangeReset()}
                        callbackWhenMount={() => {}}
                    />

                    <Field
                        name={`${FIELDS.FIELD}.${FIELDS.LABEL}`}
                        component={InputField}
                        isRequired
                        hint={Lng.t('customFields.label', {
                            locale
                        })}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true
                        }}
                    />

                    {this.DATA_TYPE_OPTION_BASE_VIEW()}

                    <Field
                        name={`${FIELDS.FIELD}.${FIELDS.ORDER}`}
                        component={InputField}
                        hint={Lng.t('customFields.order', { locale })}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true,
                            keyboardType: KEYBOARD_TYPE.NUMERIC
                        }}
                        isRequired
                    />
                </View>
            </DefaultLayout>
        );
    }
}
