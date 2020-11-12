import React, { Component, Fragment } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Animated,
    StyleProp,
    ViewStyle
} from 'react-native';
import { Field, change } from 'redux-form';
import Lng from '@/lang/i18n';
import { includes } from 'lodash';
import debounce from 'lodash/debounce';
import { DOUBLE_RIGHT_ICON } from '@/assets';
import AssetSvg from '../AssetSvg';
import { InputField } from '../InputField';
import { AnimateModal } from '../AnimateModal';
import styles from './styles';
import {
    dismissKeyboard,
    hasTextLength,
    hasValue,
    isArray,
    SCREEN_WIDTH
} from '@/constants';
import { HtmlView } from '../HtmlView';
import { PENCIL_ICON, EYE_ICON } from '@/assets';
import { colors } from '@/styles';

export const PLACEHOLDER_TYPES = {
    CUSTOMER: 'Customer',
    INVOICE: 'Invoice',
    ESTIMATE: 'Estimate',
    EXPENSE: 'Expense',
    PAYMENT: 'Payment',
    PREDEFINE_CUSTOMER: 'Predefine_Customer',
    PREDEFINE_COMPANY: 'Predefine_Company',
    PREDEFINE_BILLING: 'Predefine_Billing',
    PREDEFINE_SHIPPING: 'Predefine_Shipping'
};

interface IProps {
    reference?: any;
    customFields?: Array<any>;
    types?: Array<String>;
    name?: String;
    label?: String;
    dispatch?: Function;
    form?: String;
    locale?: String;
    formValues?: any;
    isRequired?: boolean;
    showPreview?: boolean;
    customRightLabelComponent?: any;
    fieldInputProps?: any;
    placeholder?: String;
    htmlViewStyle?: StyleProp<ViewStyle>;
    containerStyle: StyleProp<ViewStyle>;
    labelStyle: StyleProp<ViewStyle>;
    previewLabelStyle: StyleProp<ViewStyle>;
    previewContainerStyle: StyleProp<ViewStyle>;
}

interface IStates {
    visible: boolean;
    preview: boolean;
    hasError: boolean;
}

export class Editor extends Component<IProps, IStates> {
    animatedOpacityReverse: any;
    constructor(props) {
        super(props);
        this.animatedOpacityReverse = new Animated.Value(1);

        this.state = {
            visible: false,
            preview: props?.showPreview ? true : false,
            hasError: false
        };
    }

    componentDidMount() {
        this.props?.reference?.(this);
        this.setHasErrorToTrue = debounce(this.setHasErrorToTrue, 300);
    }

    componentWillUnmount() {
        this.props?.reference?.(undefined);
    }

    onToggleModal = () => {
        dismissKeyboard();
        this.setState({ visible: !this.state.visible });
    };

    togglePreview = () => {
        this.reverseOpacityAnimation();

        setTimeout(() => {
            this.setState({ preview: !this.state.preview });
            this.reverseOpacityAnimation(1);
        }, 300);
    };

    reverseOpacityAnimation = (toValue = 0) => {
        Animated.timing(this.animatedOpacityReverse, {
            toValue,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    setHasErrorToTrue = hasError => {
        this.setState({ hasError });
    };

    onSelectPlaceholder = value => {
        this.onToggleModal();
        this.updateValue(value);
    };

    updateValue = value => {
        const { dispatch, form, name, formValues } = this.props;
        let val = '';

        if (hasValue(formValues?.[name])) {
            val = `${formValues[name]}{${value}}`;
        } else {
            val = `{${value}}`;
        }

        dispatch(change(form, name, val));
    };

    getFormattedFields = (fields, type) => {
        const formattedFields = [];

        for (const field of fields) {
            if (field.model_type === type) {
                formattedFields.push({
                    label: field.label,
                    value: field.slug
                });
            }
        }

        const canAddLink = !(
            type === PLACEHOLDER_TYPES.CUSTOMER ||
            type === PLACEHOLDER_TYPES.EXPENSE
        );

        if (canAddLink) {
            formattedFields.push({
                label: `${type} Link`,
                value: `${type.toUpperCase()}_LINK`
            });
        }

        return {
            label: `${type.toUpperCase()} CUSTOM`,
            fields: formattedFields
        };
    };

    getFields = () => {
        const { customFields = [], types = [] } = this.props;

        if (!isArray(types)) {
            return [];
        }

        const items = [];

        if (includes(types, PLACEHOLDER_TYPES.PREDEFINE_COMPANY)) {
            items.push({
                label: 'Company',
                fields: [
                    { label: 'Company Name', value: 'COMPANY_NAME' },
                    { label: 'Country', value: 'COMPANY_COUNTRY' },
                    { label: 'State', value: 'COMPANY_STATE' },
                    { label: 'City', value: 'COMPANY_CITY' },
                    {
                        label: 'Address Street 1',
                        value: 'COMPANY_ADDRESS_STREET_1'
                    },
                    {
                        label: 'Address Street 2',
                        value: 'COMPANY_ADDRESS_STREET_2'
                    },
                    { label: 'Phone', value: 'COMPANY_PHONE' },
                    { label: 'Zip Code', value: 'COMPANY_ZIP_CODE' }
                ]
            });
        }

        if (includes(types, PLACEHOLDER_TYPES.PREDEFINE_BILLING)) {
            items.push({
                label: 'Billing Address',
                fields: [
                    { label: 'Address name', value: 'BILLING_ADDRESS_NAME' },
                    { label: 'Country', value: 'BILLING_COUNTRY' },
                    { label: 'State', value: 'BILLING_STATE' },
                    { label: 'City', value: 'BILLING_CITY' },
                    {
                        label: 'Address Street 1',
                        value: 'BILLING_ADDRESS_STREET_1'
                    },
                    {
                        label: 'Address Street 2',
                        value: 'BILLING_ADDRESS_STREET_2'
                    },
                    { label: 'Phone', value: 'BILLING_PHONE' },
                    { label: 'Zip Code', value: 'BILLING_ZIP_CODE' }
                ]
            });
        }

        if (includes(types, PLACEHOLDER_TYPES.PREDEFINE_SHIPPING)) {
            items.push({
                label: 'Shipping Address',
                fields: [
                    { label: 'Address name', value: 'SHIPPING_ADDRESS_NAME' },
                    { label: 'Country', value: 'SHIPPING_COUNTRY' },
                    { label: 'State', value: 'SHIPPING_STATE' },
                    { label: 'City', value: 'SHIPPING_CITY' },
                    {
                        label: 'Address Street 1',
                        value: 'SHIPPING_ADDRESS_STREET_1'
                    },
                    {
                        label: 'Address Street 2',
                        value: 'SHIPPING_ADDRESS_STREET_2'
                    },
                    { label: 'Phone', value: 'SHIPPING_PHONE' },
                    { label: 'Zip Code', value: 'SHIPPING_ZIP_CODE' }
                ]
            });
        }

        if (includes(types, PLACEHOLDER_TYPES.PREDEFINE_CUSTOMER)) {
            items.push({
                label: 'CUSTOMER',
                fields: [
                    { label: 'Display Name', value: 'CONTACT_DISPLAY_NAME' },
                    { label: 'Contact Name', value: 'PRIMARY_CONTACT_NAME' },
                    { label: 'Email', value: 'CONTACT_EMAIL' },
                    { label: 'Phone', value: 'CONTACT_PHONE' },
                    { label: 'Website', value: 'CONTACT_WEBSITE' }
                ]
            });
        }

        for (const type of types) {
            for (const field of customFields) {
                if (field.model_type === type) {
                    items.push(this.getFormattedFields(customFields, type));
                    break;
                }
            }
        }

        return this.getFieldsView(items);
    };

    getFieldsView = items => {
        if (!isArray(items)) {
            return [];
        }

        return items.map((item, index) => {
            const { label, fields } = item;
            const isFirst = index === 0;
            const isOnlyOne = items.length === 1;

            const containerStyle = [
                !isFirst && { paddingLeft: 15 },
                isOnlyOne && {
                    width: SCREEN_WIDTH - 50
                }
            ];

            return (
                <View style={containerStyle}>
                    <View style={styles.labelView}>
                        <Text style={styles.label} numberOfLines={1}>
                            {label}
                        </Text>
                    </View>
                    {fields.map(field => (
                        <TouchableOpacity
                            onPress={() =>
                                this.onSelectPlaceholder(field.value)
                            }
                            style={styles.item}
                        >
                            <View style={styles.arrowIcon}>
                                <AssetSvg
                                    name={DOUBLE_RIGHT_ICON}
                                    width={14}
                                    height={14}
                                />
                            </View>
                            <Text style={styles.itemText} numberOfLines={1}>
                                {field.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        });
    };

    getValue = () => {
        const { name, formValues } = this.props;

        if (name.includes('.')) {
            const split = name.split('.');
            return formValues?.[split[0]]?.[split[1]];
        }

        return formValues?.[name];
    };

    render() {
        const {
            locale,
            name,
            isRequired,
            customRightLabelComponent,
            fieldInputProps,
            placeholder,
            htmlViewStyle,
            containerStyle,
            previewContainerStyle,
            labelStyle,
            previewLabelStyle
        } = this.props;
        const { visible, preview, hasError } = this.state;

        const items = this.getFields();
        const hasFields = isArray(items);
        const value = this.getValue();

        const label = (
            <View
                style={[styles.row, labelStyle, preview && previewLabelStyle]}
            >
                <View style={{ flex: 1 }}>
                    <Text style={styles.hint}>
                        {Lng.t(this.props.label, { locale })}
                        {isRequired ? (
                            <Text style={styles.required}> *</Text>
                        ) : null}
                    </Text>
                </View>
                <Animated.View
                    style={[
                        styles.rowCenter,
                        { opacity: this.animatedOpacityReverse }
                    ]}
                >
                    {preview ? (
                        <TouchableOpacity
                            onPress={this.togglePreview}
                            hitSlop={{
                                top: 20,
                                left: 25,
                                bottom: 20,
                                right: 20
                            }}
                        >
                            <View style={styles.pencilIconView}>
                                <AssetSvg
                                    name={PENCIL_ICON}
                                    width={19}
                                    height={19}
                                    fill={colors.primaryLight}
                                />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <>
                            {customRightLabelComponent &&
                                customRightLabelComponent}
                            {hasFields && (
                                <TouchableOpacity onPress={this.onToggleModal}>
                                    <Text style={styles.insertFields}>
                                        {Lng.t('notes.insertFields', {
                                            locale
                                        })}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {hasValue(value) && hasTextLength(value) && (
                                <TouchableOpacity
                                    onPress={this.togglePreview}
                                    style={styles.eyeIconView}
                                    hitSlop={{
                                        top: 20,
                                        left: 10,
                                        bottom: 30,
                                        right: 10
                                    }}
                                >
                                    <AssetSvg
                                        name={EYE_ICON}
                                        width={24}
                                        height={24}
                                        fill={colors.primaryLight}
                                    />
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </Animated.View>
            </View>
        );

        let fieldProps = {};
        if (isRequired) {
            fieldProps = {
                onError: this.setHasErrorToTrue
            };
        }

        const field = (
            <Field
                name={name}
                component={InputField}
                height={150}
                inputProps={{
                    returnKeyType: 'next',
                    autoCapitalize: 'none',
                    autoCorrect: true,
                    multiline: true,
                    placeholder
                }}
                {...fieldInputProps}
                {...fieldProps}
            />
        );

        const modal = (
            <AnimateModal
                visible={visible}
                onToggle={this.onToggleModal}
                modalProps={{
                    animationIn: 'slideInUp',
                    animationOut: 'slideOutDown'
                }}
            >
                <View style={styles.modalViewContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                    >
                        <View style={styles.body}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                            >
                                <View style={styles.items}>{items}</View>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>
            </AnimateModal>
        );

        const htmlPreview = (
            <Animated.View
                style={[
                    styles.htmlView,
                    {
                        opacity: this.animatedOpacityReverse
                    },
                    htmlViewStyle,
                    hasError && styles.error
                ]}
            >
                <HtmlView
                    content={
                        hasValue(value) && hasTextLength(value)
                            ? value
                            : '<p></p>'
                    }
                />
                {hasError && (
                    <View style={styles.validation}>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: 'white',
                                fontSize: 12,
                                textAlign: 'left'
                            }}
                        >
                            {Lng.t('validation.required', { locale })}
                        </Text>
                    </View>
                )}
            </Animated.View>
        );

        const children = (
            <View style={[containerStyle, preview && previewContainerStyle]}>
                {label}
                {!preview ? (
                    <Animated.View
                        style={{ opacity: this.animatedOpacityReverse }}
                    >
                        {field}
                        {modal}
                    </Animated.View>
                ) : (
                    htmlPreview
                )}
            </View>
        );

        return children;
    }
}
