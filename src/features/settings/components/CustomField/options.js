import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { CUSTOM_FIELDS as FIELDS } from '../../constants';
import {
    InputField,
    DatePickerField,
    TimePickerField,
    SelectFieldOptions,
    SelectPickerField,
    CheckBox,
    DateTimePickerField
} from '@/components';
import { View, Text } from 'react-native';
import styles from './styles';
import { KEYBOARD_TYPE, MAX_LENGTH, hasFieldValue } from '@/api/global';
import moment from 'moment';
import Lng from '@/api/lang/i18n';

// Custom Field Refs
// -----------------------------------------
export let customFieldRefs = {};
export const setCustomFieldRefs = refs => (customFieldRefs = refs);

const DEFAULT_TIME_FIELD = () => {
    const { language } = customFieldRefs?.props;
    return (
        <Field
            name={`${FIELDS.FIELD}.${FIELDS.DEFAULT_VALUE}`}
            component={TimePickerField}
            label={Lng.t('customFields.defaultValue', { locale: language })}
            language={language}
        />
    );
};

const DEFAULT_NUMBER_FIELD = symbol => {
    const { language, currency } = customFieldRefs?.props;
    return (
        <Field
            name={`${FIELDS.FIELD}.${FIELDS.DEFAULT_VALUE}`}
            component={InputField}
            hint={Lng.t('customFields.defaultValue', { locale: language })}
            inputProps={{
                returnKeyType: 'next',
                autoCorrect: true,
                keyboardType: KEYBOARD_TYPE.NUMERIC
            }}
            leftSymbol={symbol ?? currency?.symbol}
        />
    );
};

const DEFAULT_DATE_FIELD = () => {
    const { language } = customFieldRefs?.props;
    return (
        <Field
            name={`${FIELDS.FIELD}.${FIELDS.DEFAULT_VALUE}`}
            component={DatePickerField}
            label={Lng.t('customFields.defaultValue', { locale: language })}
            icon={'calendar-alt'}
            formDateFormat="YYYY-MM-DD"
        />
    );
};

const DEFAULT_INPUT_FIELD = () => {
    const { language } = customFieldRefs?.props;
    return (
        <Field
            name={`${FIELDS.FIELD}.${FIELDS.DEFAULT_VALUE}`}
            component={InputField}
            hint={Lng.t('customFields.defaultValue', {
                locale: language
            })}
            inputProps={{
                returnKeyType: 'next',
                autoCorrect: true
            }}
        />
    );
};

const DEFAULT_TEXTAREA_FIELD = () => {
    const { language } = customFieldRefs?.props;
    return (
        <Field
            name={`${FIELDS.FIELD}.${FIELDS.DEFAULT_VALUE}`}
            component={InputField}
            hint={Lng.t('customFields.defaultValue', {
                locale: language
            })}
            inputProps={{
                returnKeyType: 'next',
                autoCapitalize: 'none',
                autoCorrect: true,
                multiline: true,
                maxLength: MAX_LENGTH
            }}
            height={80}
        />
    );
};

const PLACEHOLDER_FIELD = () => {
    const { language } = customFieldRefs?.props;
    return (
        <Field
            name={`${FIELDS.FIELD}.${FIELDS.PLACEHOLDER}`}
            component={InputField}
            hint={Lng.t('customFields.placeholder', {
                locale: language
            })}
            inputProps={{
                returnKeyType: 'next',
                autoCorrect: true
            }}
        />
    );
};

const SELECT_FIELD_OPTIONS = () => (
    <FieldArray
        name={`${FIELDS.FIELD}.${FIELDS.OPTIONS}`}
        component={SelectFieldOptions}
        addFirstItem
        removeFirstItemOnPress
    />
);

const SELECT_FIELD_DEFAULT_VALUE = () => {
    const { language, formValues } = customFieldRefs?.props;
    const options = formValues?.[FIELDS.FIELD][FIELDS.OPTIONS];

    const optionsFormat = () => {
        const items = [];
        if (!hasFieldValue(options)) return [];

        options.map(option => {
            if (option && option.length !== 0)
                items.push({
                    label: option,
                    value: option
                });
        });

        return items;
    };

    return (
        <Field
            name={`${FIELDS.FIELD}.${FIELDS.DEFAULT_VALUE}`}
            component={SelectPickerField}
            label={Lng.t('customFields.defaultValue', {
                locale: language
            })}
            fieldIcon="align-center"
            items={optionsFormat()}
        />
    );
};

const DEFAULT_CHECKBOX_FIELD = () => {
    const { language } = customFieldRefs?.props;
    return (
        <Field
            name={`${FIELDS.FIELD}.${FIELDS.DEFAULT_VALUE}`}
            component={CheckBox}
            hint={Lng.t('customFields.defaultValue', { locale: language })}
            label={Lng.t('customFields.check', { locale: language })}
        />
    );
};

const DEFAULT_DATE_TIME_FIELD = () => {
    const { language } = customFieldRefs?.props;
    return (
        <Field
            name={`${FIELDS.FIELD}.${FIELDS.DEFAULT_VALUE}`}
            component={DateTimePickerField}
            label={Lng.t('customFields.defaultValue', { locale: language })}
            language={language}
        />
    );
};
export {
    DEFAULT_INPUT_FIELD,
    DEFAULT_TEXTAREA_FIELD,
    DEFAULT_NUMBER_FIELD,
    DEFAULT_DATE_FIELD,
    DEFAULT_TIME_FIELD,
    DEFAULT_DATE_TIME_FIELD,
    DEFAULT_CHECKBOX_FIELD,
    PLACEHOLDER_FIELD,
    SELECT_FIELD_OPTIONS,
    SELECT_FIELD_DEFAULT_VALUE
};
