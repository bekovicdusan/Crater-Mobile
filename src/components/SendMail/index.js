// @flow

import React, { Component } from 'react';
import { View, Keyboard, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import {
    reduxForm,
    Field,
    change,
    SubmissionError,
    getFormValues
} from 'redux-form';
import styles from './styles';
import { validate } from './validation';
import { SlideModal } from '../SlideModal';
import { InputField } from '../InputField';
import { CtButton } from '../Button';
import Lng from '@/lang/i18n';
import {
    alertMe,
    EMAIL_REGEX,
    hasObjectLength,
    hasTextLength,
    hasValue
} from '@/constants';
import { getMailConfiguration } from '../../features/more/actions';
import { Content } from '../Content';
import { Editor } from '../Editor';

type IProps = {
    handleSubmit: Function,
    onSendMail: Function,
    headerTitle: String,
    alertDesc: String
};

const emailField = {
    from: 'from',
    to: 'to',
    subject: 'subject',
    msg: 'body'
};

const MAIL_FORM = 'sendMail/MAIL_FORM';

class SendMailComponent extends Component<IProps> {
    keyboardDidShowListener: any;
    keyboardDidHideListener: any;

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            getMailConfigApiCalled: false,
            isKeyboardVisible: false
        };
    }

    componentDidMount() {
        this.props.mailReference?.(this);
        this.keyboardListener();
    }

    componentWillUnmount() {
        this.props.mailReference?.(undefined);
        this.keyboardDidShowListener?.remove?.();
        this.keyboardDidHideListener?.remove?.();
    }

    keyboardListener = () => {
        this.keyboardDidShowListener = Keyboard?.addListener?.(
            'keyboardDidShow',
            () => {
                this.setState({ isKeyboardVisible: true });
            }
        );
        this.keyboardDidHideListener = Keyboard?.addListener?.(
            'keyboardDidHide',
            () => {
                this.setState({ isKeyboardVisible: false });
            }
        );
    };

    onSendMail = values => {
        const { locale, alertDesc = '', onSendMail } = this.props;
        const { getMailConfigApiCalled } = this.state;

        if (!getMailConfigApiCalled) {
            return;
        }

        const errors = this.checkIsFieldsRequired(values);

        if (hasObjectLength(errors)) {
            throw new SubmissionError({
                ...errors
            });
        }

        alertMe({
            title: Lng.t('alert.title', { locale }),
            desc: Lng.t(alertDesc, { locale }),
            showCancel: true,
            okPress: () => {
                this.onToggle();
                setTimeout(() => onSendMail?.(values), 200);
            }
        });
    };

    checkIsFieldsRequired = values => {
        let errors = {};

        if (
            !hasValue(values?.[emailField.from]) ||
            !EMAIL_REGEX.test(values?.[emailField.from])
        ) {
            errors[emailField.from] = 'validation.email';
        }

        if (
            !hasValue(values?.[emailField.to]) ||
            !EMAIL_REGEX.test(values?.[emailField.to])
        ) {
            errors[emailField.to] = 'validation.email';
        }

        if (!hasValue(values?.[emailField.subject])) {
            errors[emailField.subject] = 'validation.required';
        }

        if (
            !hasValue(values?.[emailField.msg]) ||
            !hasTextLength(values?.[emailField.msg])
        ) {
            errors[emailField.msg] = 'validation.required';
        }

        return errors;
    };

    onToggle = async () => {
        const { visible } = this.state;
        await this.setState({ visible: !visible });
        this.getConfig();
    };

    getConfig = () => {
        const { getMailConfiguration, user, body, subject } = this.props;
        const { getMailConfigApiCalled } = this.state;

        if (!getMailConfigApiCalled) {
            getMailConfiguration({
                body,
                onSuccess: ({ from_mail, emailBody }) => {
                    this.setState({ getMailConfigApiCalled: true });
                    this.setFormField(emailField.from, from_mail);
                    this.setFormField(emailField.to, user?.email);
                    this.setFormField(emailField.subject, subject);
                    this.setFormField(emailField.msg, emailBody);
                }
            });
        }
    };

    setFormField = (field, value) => {
        this.props.dispatch(change(MAIL_FORM, field, value || undefined));
    };

    BOTTOM_ACTION = (handleSubmit, locale, isKeyboardVisible) => {
        if (isKeyboardVisible) {
            return null;
        }

        return (
            <View style={styles.submitButton}>
                <View style={{ flex: 1 }}>
                    <CtButton
                        onPress={handleSubmit(this.onSendMail)}
                        btnTitle={Lng.t('button.send', { locale })}
                        containerStyle={styles.handleBtn}
                    />
                </View>
            </View>
        );
    };

    Screen = () => {
        const { isKeyboardVisible } = this.state;
        const { locale } = this.props;
        let mailRefs = {};

        return (
            <ScrollView
                style={[isKeyboardVisible && { paddingBottom: 120 }]}
                keyboardShouldPersistTaps="handled"
            >
                <Field
                    name={emailField.from}
                    component={InputField}
                    hint={Lng.t('sendMail.from', { locale })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        keyboardType: 'email-address',
                        onSubmitEditing: () => mailRefs.to.focus()
                    }}
                    isRequired
                />

                <Field
                    name={emailField.to}
                    component={InputField}
                    hint={Lng.t('sendMail.to', { locale })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        keyboardType: 'email-address',
                        onSubmitEditing: () => mailRefs.subject.focus()
                    }}
                    refLinkFn={ref => (mailRefs.to = ref)}
                    isRequired
                />

                <Field
                    name={emailField.subject}
                    component={InputField}
                    hint={Lng.t('sendMail.subject', { locale })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCorrect: true
                    }}
                    refLinkFn={ref => (mailRefs.subject = ref)}
                    isRequired
                />

                <Editor
                    {...this.props}
                    name={emailField.msg}
                    label={'sendMail.body'}
                    isRequired
                    showPreview
                />
            </ScrollView>
        );
    };

    render() {
        const {
            handleSubmit,
            headerTitle = '',
            locale,
            formValues,
            theme
        } = this.props;
        const {
            visible,
            getMailConfigApiCalled,
            isKeyboardVisible
        } = this.state;

        const headerProps = {
            leftIconPress: () => this.onToggle(),
            title: Lng.t(headerTitle, { locale }),
            rightIcon: 'paper-plane',
            rightIconPress: handleSubmit(this.onSendMail),
            placement: 'center',
            hasCircle: false,
            noBorder: false,
            transparent: false
        };

        return (
            <SlideModal
                defaultLayout
                visible={visible}
                onToggle={this.onToggle}
                headerProps={headerProps}
                bottomAction={this.BOTTOM_ACTION(
                    handleSubmit,
                    locale,
                    isKeyboardVisible
                )}
            >
                <Content
                    loadingProps={{
                        is:
                            !hasObjectLength(formValues) ||
                            !getMailConfigApiCalled,
                        style: styles.loadingContainer
                    }}
                    theme={theme}
                >
                    {this.Screen()}
                </Content>
            </SlideModal>
        );
    }
}

const mapStateToProps = state => {
    return {
        locale: state?.global?.locale,
        formValues: getFormValues(MAIL_FORM)(state) || {},
        theme: state?.global?.theme
    };
};

const mapDispatchToProps = {
    getMailConfiguration
};
//  Redux Forms
const SendMailReduxForm = reduxForm({
    form: MAIL_FORM,
    validate
})(SendMailComponent);

//  connect
export const SendMail = connect(
    mapStateToProps,
    mapDispatchToProps
)(SendMailReduxForm);
