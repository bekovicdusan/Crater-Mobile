import React from 'react';
import { Field } from 'redux-form';
import { InputField } from '../../InputField';
import { KEYBOARD_TYPE } from '@/api/global';

export function NumberType({ field, name }) {
    const { label = null, is_required = false, placeholder = null } = field;

    return (
        <Field
            name={name}
            component={InputField}
            hint={label}
            inputProps={{
                returnKeyType: 'next',
                autoCorrect: true,
                placeholder,
                keyboardType: KEYBOARD_TYPE.NUMERIC
            }}
            isRequired={is_required}
        />
    );
}
