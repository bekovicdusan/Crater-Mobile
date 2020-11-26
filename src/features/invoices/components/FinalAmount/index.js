import React from 'react';
import { View, Text } from 'react-native';
import { Field, change } from 'redux-form';
import styles from './styles';
import {
    InputField,
    CtDivider,
    SelectField,
    SelectPickerField,
    CurrencyFormat
} from '@/components';
import { ROUTES } from '@/navigation';
import { colors } from '@/styles';
import Lng from '@/lang/i18n';
import { INVOICE_DISCOUNT_OPTION } from '../../constants';
import { ADD_TAX } from '@/features/settings/constants';
import {
    invoiceSubTotal,
    getCompoundTaxValue,
    invoiceItemTotalTaxes,
    getTaxValue,
    getTaxName,
    finalAmount
} from '../InvoiceCalculation';
import { isIosPlatform } from '@/constants';

const DISPLAY_ITEM_TAX = ({ state }) => {
    const { currency } = state;
    let taxes = invoiceItemTotalTaxes();

    return taxes
        ? taxes.map((val, index) => (
              <View style={styles.subContainer} key={index}>
                  <View>
                      <Text style={styles.amountHeading}>
                          {getTaxName(val)} ({val.percent} %)
                      </Text>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                      <CurrencyFormat
                          amount={val.amount}
                          currency={currency}
                          style={styles.subAmount}
                      />
                  </View>
              </View>
          ))
        : null;
};

const FinalAmount = ({ state, props }) => {
    const { currency } = state;

    const {
        locale,
        taxTypes,
        navigation,
        invoiceData: { discount_per_item, tax_per_item },
        formValues,
        getTaxes
    } = props;

    let taxes = formValues?.taxes;

    let taxPerItem = !(
        tax_per_item === 'NO' ||
        typeof tax_per_item === 'undefined' ||
        tax_per_item === null ||
        tax_per_item === '0'
    );

    let discountPerItem = !(
        discount_per_item === 'NO' ||
        typeof discount_per_item === 'undefined' ||
        discount_per_item === null ||
        discount_per_item === '0'
    );

    const setFormField = (field, value) => {
        const { dispatch, form } = props;

        dispatch(change(form, field, value));
    };

    return (
        <View style={styles.amountContainer}>
            <View style={styles.subContainer}>
                <View>
                    <Text style={styles.amountHeading}>
                        {Lng.t('invoices.subtotal', { locale })}
                    </Text>
                </View>
                <View style={{ marginTop: isIosPlatform() ? 6 : 4 }}>
                    <CurrencyFormat
                        amount={invoiceSubTotal()}
                        currency={currency}
                        style={styles.subAmount}
                    />
                </View>
            </View>

            {!discountPerItem && (
                <View style={[styles.subContainer, styles.discount]}>
                    <View>
                        <Text style={styles.amountHeading}>
                            {Lng.t('invoices.discount', { locale })}
                        </Text>
                    </View>
                    <View style={[styles.subAmount, styles.discountField]}>
                        <Field
                            name="discount"
                            component={InputField}
                            inputProps={{
                                returnKeyType: 'next',
                                autoCapitalize: 'none',
                                autoCorrect: true,
                                keyboardType: 'numeric'
                            }}
                            fieldStyle={styles.fieldStyle}
                        />
                        <Field
                            name="discount_type"
                            component={SelectPickerField}
                            items={INVOICE_DISCOUNT_OPTION}
                            onChangeCallback={val => {
                                setFormField('discount_type', val);
                            }}
                            isFakeInput
                            defaultPickerOptions={{
                                label: 'Fixed',
                                value: 'fixed',
                                color: colors.secondary,
                                displayLabel: currency ? currency.symbol : '$'
                            }}
                            fakeInputValueStyle={styles.fakeInputValueStyle}
                            fakeInputContainerStyle={styles.selectPickerField}
                            containerStyle={styles.SelectPickerContainer}
                        />
                    </View>
                </View>
            )}

            {taxes &&
                taxes.map((val, index) =>
                    !val.compound_tax ? (
                        <View style={styles.subContainer} key={index}>
                            <View>
                                <Text style={styles.amountHeading}>
                                    {getTaxName(val)} ({val.percent} %)
                                </Text>
                            </View>
                            <View>
                                <CurrencyFormat
                                    amount={getTaxValue(val.percent)}
                                    currency={currency}
                                    style={styles.subAmount}
                                />
                            </View>
                        </View>
                    ) : null
                )}

            {taxes &&
                taxes.map((val, index) =>
                    val.compound_tax ? (
                        <View style={styles.subContainer} key={index}>
                            <View>
                                <Text style={styles.amountHeading}>
                                    {getTaxName(val)} ({val.percent} %)
                                </Text>
                            </View>
                            <View>
                                <CurrencyFormat
                                    amount={getCompoundTaxValue(val.percent)}
                                    currency={currency}
                                    style={styles.subAmount}
                                />
                            </View>
                        </View>
                    ) : null
                )}

            {DISPLAY_ITEM_TAX({ state })}

            {!taxPerItem && (
                <Field
                    name="taxes"
                    apiSearch
                    hasPagination
                    items={taxTypes}
                    getItems={getTaxes}
                    displayName="name"
                    component={SelectField}
                    onlyPlaceholder
                    fakeInputProps={{
                        fakeInput: (
                            <Text style={styles.taxFakeInput}>
                                {Lng.t('invoices.taxPlaceholder', { locale })}
                            </Text>
                        )
                    }}
                    navigation={navigation}
                    isMultiSelect
                    locale={locale}
                    concurrentMultiSelect
                    compareField="id"
                    valueCompareField="tax_type_id"
                    headerProps={{ title: Lng.t('taxes.title', { locale }) }}
                    rightIconPress={() =>
                        navigation.navigate(ROUTES.TAX, {
                            type: ADD_TAX,
                            onSelect: val => {
                                setFormField('taxes', [...val, ...taxes]);
                            }
                        })
                    }
                    listViewProps={{ contentContainerStyle: { flex: 2 } }}
                    emptyContentProps={{ contentType: 'taxes' }}
                />
            )}

            <CtDivider dividerStyle={styles.divider} />

            <View style={[styles.subContainer]}>
                <View>
                    <Text style={styles.amountHeading}>
                        {Lng.t('invoices.totalAmount', { locale })}:
                    </Text>
                </View>
                <View style={{ marginTop: isIosPlatform() ? 4 : 3 }}>
                    <CurrencyFormat
                        amount={finalAmount()}
                        currency={currency}
                        style={styles.finalAmount}
                        currencyStyle={{
                            marginTop: isIosPlatform() ? -1.5 : -6
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

export default FinalAmount;
