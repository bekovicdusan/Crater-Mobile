import React from 'react';
import {Field} from 'redux-form';
import {InputField, SelectPickerField} from '@/components';
import t from 'locales/use-translation';
import {FREQUENCIES_TYPES} from 'stores/recurring-invoices/helpers';
import {colors} from '@/styles';

interface IProps {
  /**
   * An object with data for frequency-field field.
   */
  frequencyField?: object;

  /**
   * An object with data for frequency-picker-field field.
   */
  frequencyPickerField?: object;

  /**
   * An function to return when field changed.
   */
  onChangeCallback: () => void;

  /**
   * An function to return when field is mounted.
   */
  callbackWhenMount: () => void;
}

export const FrequencyField = (props: IProps) => {
  const {
    frequencyField,
    frequencyPickerField,
    onChangeCallback,
    callbackWhenMount
  } = props;

  return (
    <>
      <Field
        name={frequencyPickerField.name}
        label={t('recurring_invoices.select_frequency')}
        component={SelectPickerField}
        fieldIcon="sync"
        items={FREQUENCIES_TYPES}
        placeholderTextColor={colors.secondary}
        onChangeCallback={onChangeCallback}
        callbackWhenMount={callbackWhenMount}
        isRequired
      />
      {!frequencyPickerField.value && (
        <Field
          name={frequencyField.name}
          component={InputField}
          hint={t('recurring_invoices.display_frequency')}
          callbackWhenMount={callbackWhenMount}
          disabled={frequencyPickerField.value}
          inputProps={{}}
          meta={{}}
          isDebounce
        />
      )}
    </>
  );
};
