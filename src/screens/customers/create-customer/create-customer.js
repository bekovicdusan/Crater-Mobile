import React, {Component} from 'react';
import {Field, change, initialize} from 'redux-form';
import {pick} from 'lodash';
import t from 'locales/use-translation';
import {IProps, IStates} from './create-customer-type';
import {styles} from './create-customer-style';
import {isEmpty} from '@/constants';
import {keyboardType} from '@/helpers/keyboard';
import {secondaryHeader} from 'utils/header';
import {CREATE_CUSTOMER_FORM} from 'stores/customer/types';
import {CurrencySelectModal} from '@/select-modal';
import {routes} from '@/navigation';
import {getApiFormattedCustomFields} from '@/utils';
import options from './customer-dropdown';
import {addressParams, isAddress} from 'stores/customer/helpers';
import {
  BaseButton,
  BaseButtonGroup,
  BaseInput,
  BaseSelect,
  CustomField,
  DefaultLayout
} from '@/components';
import {
  addCustomer,
  updateCustomer,
  fetchSingleCustomer,
  fetchCustomerInitialDetails
} from 'stores/customer/actions';

export default class CreateCustomer extends Component<IProps, IStates> {
  constructor(props) {
    super(props);
    this.state = {isFetchingInitialData: true};
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const {isEditScreen, id, dispatch, currency} = this.props;
    if (isEditScreen) {
      dispatch(
        fetchSingleCustomer(id, customer => this.setInitialData(customer))
      );
      return;
    }

    dispatch(
      fetchCustomerInitialDetails(() => {
        this.setFormField(`currency_id`, currency?.id);
        this.setState({isFetchingInitialData: false});
      })
    );
  };

  setInitialData = customer => {
    const {dispatch} = this.props;
    const data = pick(customer, [
      'name',
      'contact_name',
      'email',
      'phone',
      'website',
      'currency_id',
      'customFields',
      'billing',
      'shipping',
      'fields'
    ]);
    dispatch(initialize(CREATE_CUSTOMER_FORM, data));
    this.setState({isFetchingInitialData: false});
  };

  onSave = values => {
    const {id, isCreateScreen, navigation, dispatch, route} = this.props;
    const {isFetchingInitialData} = this.state;

    if (this.props.isSaving || this.props.isDeleting || isFetchingInitialData) {
      return;
    }

    const onSuccess = res => {
      const onSelect = route?.params?.onSelect;
      onSelect?.(res);
      navigation.goBack(null);
    };

    const params = {
      id,
      params: {
        ...values,
        customFields: getApiFormattedCustomFields(values?.customFields),
        billing: addressParams(values?.billing),
        shipping: addressParams(values?.shipping)
      },
      onSuccess
    };

    isCreateScreen
      ? dispatch(addCustomer(params))
      : dispatch(updateCustomer(params));
  };

  setFormField = (field, value) => {
    this.props.dispatch(change(CREATE_CUSTOMER_FORM, field, value));
  };

  navigateToAddress = type => {
    const {navigation, isAllowToEdit, formValues} = this.props;
    const disabled = !isAllowToEdit;
    navigation.navigate(routes.CUSTOMER_ADDRESS, {
      type,
      disabled,
      initialData: formValues?.[type],
      billingAddress: formValues?.billing,
      callback: values => this.setFormField(type, values)
    });
  };

  render() {
    const {
      handleSubmit,
      theme,
      currencies,
      customFields,
      isAllowToEdit,
      isEditScreen,
      formValues,
      isSaving,
      isDeleting
    } = this.props;

    const {isFetchingInitialData} = this.state;

    const disabled = !isAllowToEdit;

    const headerProps = secondaryHeader({
      ...this.props,
      rightIconPress: handleSubmit(this.onSave)
    });

    const customerRefs: any = {};

    const hasCustomField = isEditScreen
      ? formValues && formValues.hasOwnProperty('fields')
      : !isEmpty(customFields);

    const billing = formValues?.billing;
    const shipping = formValues?.shipping;

    const bottomAction = (
      <BaseButtonGroup>
        <BaseButton
          loading={isSaving}
          disabled={isFetchingInitialData || isDeleting}
          onPress={handleSubmit(this.onSave)}
          show={isAllowToEdit}
        >
          {t('button.save')}
        </BaseButton>
      </BaseButtonGroup>
    );

    return (
      <DefaultLayout
        headerProps={headerProps}
        loadingProps={{is: isFetchingInitialData}}
        bottomAction={bottomAction}
        dropdownProps={options(this)}
      >
        <Field
          name="name"
          component={BaseInput}
          isRequired
          hint={t('customers.display_name')}
          onSubmitEditing={() => customerRefs.contactName.focus()}
          keyboardType={keyboardType.DEFAULT}
          disabled={disabled}
          withRef
        />

        <Field
          name="contact_name"
          component={BaseInput}
          hint={t('customers.contact_name')}
          onSubmitEditing={() => customerRefs.email.focus()}
          keyboardType={keyboardType.DEFAULT}
          refLinkFn={ref => (customerRefs.contactName = ref)}
          disabled={disabled}
          withRef
        />

        <Field
          name="email"
          component={BaseInput}
          hint={t('customers.email')}
          onSubmitEditing={() => customerRefs.phone.focus()}
          keyboardType={keyboardType.EMAIL}
          refLinkFn={ref => (customerRefs.email = ref)}
          disabled={disabled}
        />

        <Field
          name="phone"
          component={BaseInput}
          hint={t('customers.phone')}
          onSubmitEditing={() => customerRefs.website.focus()}
          keyboardType={keyboardType.PHONE}
          refLinkFn={ref => (customerRefs.phone = ref)}
          disabled={disabled}
        />

        <Field
          name="website"
          component={BaseInput}
          hint={t('customers.website')}
          keyboardType={keyboardType.URL}
          refLinkFn={ref => (customerRefs.website = ref)}
          disabled={disabled}
        />

        {hasCustomField && <CustomField {...this.props} type={null} />}

        <Field
          name="currency_id"
          currencies={currencies}
          component={CurrencySelectModal}
          onSelect={val => this.setFormField(`currency_id`, val.id)}
          theme={theme}
          disabled={disabled}
          baseSelectProps={{
            rightIcon: 'angle-right',
            containerStyle: styles.currency
          }}
        />

        <BaseSelect
          icon="map-marker-alt"
          rightIcon="angle-right"
          placeholder={t('customers.billing_address')}
          values={isAddress(billing) && t('customers.billing_address')}
          containerStyle={styles.billing}
          onChangeCallback={() => this.navigateToAddress('billing')}
        />

        <BaseSelect
          icon="map-marker-alt"
          rightIcon="angle-right"
          placeholder={t('customers.shipping_address')}
          values={isAddress(shipping) && t('customers.shipping_address')}
          containerStyle={styles.shipping}
          onChangeCallback={() => this.navigateToAddress('shipping')}
        />
      </DefaultLayout>
    );
  }
}
