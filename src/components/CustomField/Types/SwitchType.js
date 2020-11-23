import React from 'react';
import { Field } from 'redux-form';
import { StyleSheet } from 'react-native';
import ToggleSwitch from '@/components/ToggleSwitch';

export function SwitchType({ field, name }) {
    const { label = null, is_required = false } = field;

    return (
        <Field
            name={name}
            component={ToggleSwitch}
            isRequired={is_required}
            hint={label ?? ' '}
            hintStyle={styles.label}
            containerStyle={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start'
    },
    label: {
        width: 'auto',
        marginRight: 15
    }
});
