// @flow

import React from 'react';
import { View } from 'react-native';
import { Field, change } from 'redux-form';
import styles from './styles';
import {
    InputField,
    CtButton,
    DefaultLayout,
    ToggleSwitch,
    Text
} from '@/components';
import { goBack, MOUNT, UNMOUNT } from '@/navigation';
import t from 'locales/use-translation';
import {
    EDIT_CURRENCY_TYPE,
    CREATE_CURRENCY_TYPE,
    CURRENCY_FORM
} from '../../constants';
import { alertMe, BUTTON_COLOR, hasObjectLength } from '@/constants';

type IProps = {
    navigation: Object,
    formValues: Object,
    handleSubmit: Function,
    createCurrency: Function,
    editCurrency: Function,
    type: String,
    getEditCategoryLoading: Boolean,
    currencyLoading: Boolean,
    id: Number
};

export class Currency extends React.Component<IProps> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { navigation } = this.props;
        goBack(MOUNT, navigation);
    }

    componentWillUnmount() {
        goBack(UNMOUNT);
    }

    setFormField = (field, value) => {
        this.props.dispatch(change(CURRENCY_FORM, field, value));
    };

    onSubmit = values => {
        const {
            id,
            type,
            createCurrency,
            editCurrency,
            navigation,
            currencyLoading
        } = this.props;

        if (!currencyLoading) {
            if (type === CREATE_CURRENCY_TYPE)
                createCurrency({ params: values, navigation });
            else {
                editCurrency({ id, params: values, navigation });
            }
        }
    };

    removeCategory = () => {
        const { removeCurrency, navigation, id } = this.props;

        alertMe({
            title: t('alert.title'),
            desc: t('currencies.alertDescription'),
            showCancel: true,
            okPress: () => removeCurrency({ id, navigation })
        });
    };

    BOTTOM_ACTION = handleSubmit => {
        const { currencyLoading, type } = this.props;

        return (
            <View
                style={[
                    styles.submitButton,
                    type === EDIT_CURRENCY_TYPE && styles.multipleButton
                ]}
            >
                <CtButton
                    onPress={handleSubmit(this.onSubmit)}
                    btnTitle={t('button.save')}
                    buttonContainerStyle={
                        type === EDIT_CURRENCY_TYPE && styles.flex
                    }
                    containerStyle={styles.btnContainerStyle}
                    loading={currencyLoading}
                />

                {type === EDIT_CURRENCY_TYPE && (
                    <CtButton
                        onPress={this.removeCategory}
                        btnTitle={t('button.remove')}
                        buttonColor={BUTTON_COLOR.DANGER}
                        containerStyle={styles.btnContainerStyle}
                        buttonContainerStyle={styles.flex}
                        loading={currencyLoading}
                    />
                )}
            </View>
        );
    };

    POSITION_VIEW = () => {
        return (
            <View style={styles.row}>
                <View style={styles.positionView}>
                    <Text secondary h4>
                        {t('currencies.position')}
                    </Text>
                </View>

                <View style={styles.column}>
                    <Field
                        name="position"
                        component={ToggleSwitch}
                        hint={t('currencies.left')}
                        hintStyle={styles.leftText}
                    />
                </View>

                <View style={styles.columnRight}>
                    <Text secondary h4>
                        {t('currencies.right')}
                    </Text>
                </View>
            </View>
        );
    };

    render() {
        const { navigation, handleSubmit, type, formValues } = this.props;
        let currencyRefs = {};

        return (
            <DefaultLayout
                headerProps={{
                    leftIconPress: () => {
                        navigation.goBack(null);
                    },
                    title:
                        type === EDIT_CURRENCY_TYPE
                            ? t('header.editCurrency')
                            : t('header.addCurrency'),
                    placement: 'center',
                    rightIcon: 'save',
                    rightIconProps: {
                        solid: true
                    },
                    rightIconPress: handleSubmit(this.onSubmit)
                }}
                loadingProps={{
                    is: !hasObjectLength(formValues)
                }}
            >
                <Field
                    name="name"
                    component={InputField}
                    isRequired
                    hint={t('currencies.name')}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCorrect: true,
                        onSubmitEditing: () => currencyRefs.code.focus()
                    }}
                />

                <Field
                    name="code"
                    component={InputField}
                    isRequired
                    hint={t('currencies.code')}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCorrect: true,
                        onSubmitEditing: () => currencyRefs.symbol.focus()
                    }}
                    refLinkFn={ref => {
                        currencyRefs.code = ref;
                    }}
                />

                <Field
                    name="symbol"
                    component={InputField}
                    isRequired
                    hint={t('currencies.symbol')}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCorrect: true,
                        onSubmitEditing: () => currencyRefs.precision.focus()
                    }}
                    refLinkFn={ref => {
                        currencyRefs.symbol = ref;
                    }}
                />

                <Field
                    name="precision"
                    component={InputField}
                    isRequired
                    hint={t('currencies.precision')}
                    inputProps={{
                        returnKeyType: 'next',
                        keyboardType: 'decimal-pad',
                        autoCorrect: true,
                        onSubmitEditing: () =>
                            currencyRefs.thousSeparator.focus()
                    }}
                    refLinkFn={ref => {
                        currencyRefs.precision = ref;
                    }}
                />

                <Field
                    name="thousand_separator"
                    component={InputField}
                    isRequired
                    hint={t('currencies.thousSeparator')}
                    inputProps={{
                        returnKeyType: 'next',
                        onSubmitEditing: () => currencyRefs.decSeparator.focus()
                    }}
                    refLinkFn={ref => {
                        currencyRefs.thousSeparator = ref;
                    }}
                />

                <Field
                    name="decimal_separator"
                    component={InputField}
                    isRequired
                    hint={t('currencies.decSeparator')}
                    inputProps={{
                        returnKeyType: 'next'
                    }}
                    refLinkFn={ref => {
                        currencyRefs.decSeparator = ref;
                    }}
                />

                {this.POSITION_VIEW()}
            </DefaultLayout>
        );
    }
}
