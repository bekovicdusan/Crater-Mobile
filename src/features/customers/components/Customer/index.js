import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {Field, change} from 'redux-form';
import {
  InputField,
  DefaultLayout,
  CustomField,
  ActionButton,
  BaseButton,
  ButtonGroup
} from '@/components';
import {
  CUSTOMER_FORM,
  CUSTOMER_ACTIONS,
  ACTIONS_VALUE,
  CUSTOMER_FIELDS as FIELDS,
  isAddress
} from '../../constants';
import AddressContainer from '../../containers/Address';
import {alertMe, keyboardType, isEmpty} from '@/constants';
import t from 'locales/use-translation';
import {colors} from '@/styles/colors';
import {getApiFormattedCustomFields} from '@/utils';
import {CurrencySelectModal} from '@/select-modal';

interface IProps {
  navigation: Object;
  type: string;
  getCustomerDetail: () => void;
  createCustomer: () => void;
  updateCustomer: () => void;
  handleSubmit: () => void;
  customFields: any;
  loading: boolean;
  formValues: Object;
}

let customerRefs = {};

export class Customer extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.state = {isLoading: true};
  }

  componentDidMount() {
    this.setInitialValues();
  }

  setInitialValues = () => {
    const {
      getCustomerDetail,
      currency,
      getCreateCustomer,
      isEditScreen,
      isCreateScreen,
      id
    } = this.props;

    if (isCreateScreen) {
      getCreateCustomer({
        onSuccess: () => {
          this.setFormField(`customer.${FIELDS.CURRENCY}`, currency?.id);
          this.setState({isLoading: false});
        }
      });
      return;
    }

    if (isEditScreen) {
      getCustomerDetail({
        id,
        onSuccess: customer => {
          const values = {
            ...customer,
            [FIELDS.BILLING]: customer?.billing ?? [],
            [FIELDS.SHIPPING]: customer?.shipping ?? []
          };
          this.setFormField('customer', values);
          this.setState({isLoading: false});
        }
      });
      return;
    }
  };

  setFormField = (field, value) => {
    this.props.dispatch(change(CUSTOMER_FORM, field, value));
  };

  onSubmit = values => {
    const params = {
      ...values?.customer,
      customFields: getApiFormattedCustomFields(values?.customFields)
    };

    const {
      createCustomer,
      updateCustomer,
      navigation,
      isEditScreen,
      isCreateScreen,
      route
    } = this.props;

    if (this.state.isLoading) {
      return;
    }

    if (isCreateScreen) {
      createCustomer({
        params,
        onResult: res => {
          const onSelect = route?.params?.onSelect;
          onSelect?.(res);
          navigation.goBack(null);
        }
      });
      return;
    }

    if (isEditScreen) {
      updateCustomer({params, navigation});
      return;
    }
  };

  removeCustomer = () => {
    const {removeCustomer, navigation, route} = this.props;

    alertMe({
      title: t('alert.title'),
      desc: t('customers.alert_description'),
      showCancel: true,
      okPress: () =>
        removeCustomer({
          id: route?.params?.id,
          navigation
        })
    });
  };

  onOptionSelect = action => {
    if (action == ACTIONS_VALUE.REMOVE) this.removeCustomer();
  };

  render() {
    const {
      navigation,
      handleSubmit,
      theme,
      type,
      currencies,
      customFields,
      isAllowToEdit,
      isAllowToDelete,
      isEditScreen,
      formValues,
      loading
    } = this.props;
    const billingAddress = formValues?.customer?.[FIELDS.BILLING];
    const shippingAddress = formValues?.customer?.[FIELDS.SHIPPING];

    const {isLoading} = this.state;

    const hasCustomField = isEditScreen
      ? formValues?.customer && formValues.customer.hasOwnProperty('fields')
      : !isEmpty(customFields);

    const drownDownProps =
      isEditScreen && !isLoading && isAllowToDelete
        ? {
            options: CUSTOMER_ACTIONS(),
            onSelect: this.onOptionSelect,
            cancelButtonIndex: 1,
            destructiveButtonIndex: 2
          }
        : null;

    const disabled = !isAllowToEdit;

    const getTitle = () => {
      let title = 'header.add_customer';
      if (isEditScreen && !isAllowToEdit) title = 'header.view_customer';
      if (isEditScreen && isAllowToEdit) title = 'header.edit_customer';

      return t(title);
    };

    const bottomAction = [
      {
        label: 'button.save',
        onPress: handleSubmit(this.onSubmit),
        loading: loading || isLoading,
        show: isAllowToEdit
      }
    ];

    return (
      <DefaultLayout
        headerProps={{
          leftIconPress: () => navigation.goBack(null),
          title: getTitle(),
          placement: 'center',
          ...(!isEditScreen && {
            rightIcon: 'save',
            rightIconProps: {solid: true},
            rightIconPress: handleSubmit(this.onSubmit)
          })
        }}
        bottomAction={<ActionButton buttons={bottomAction} />}
        loadingProps={{is: isLoading}}
        dropdownProps={drownDownProps}
      >
        <Field
          name={`customer.${FIELDS.NAME}`}
          component={InputField}
          isRequired
          hint={t('customers.display_name')}
          onSubmitEditing={() => customerRefs.contactName.focus()}
          keyboardType={keyboardType.DEFAULT}
          disabled={disabled}
          withRef
        />

        <Field
          name={`customer.${FIELDS.CONTACT_NAME}`}
          component={InputField}
          hint={t('customers.contact_name')}
          onSubmitEditing={() => customerRefs.email.focus()}
          keyboardType={keyboardType.DEFAULT}
          refLinkFn={ref => (customerRefs.contactName = ref)}
          disabled={disabled}
          withRef
        />

        <Field
          name={`customer.${FIELDS.EMAIL}`}
          component={InputField}
          hint={t('customers.email')}
          onSubmitEditing={() => customerRefs.phone.focus()}
          keyboardType={keyboardType.EMAIL}
          refLinkFn={ref => (customerRefs.email = ref)}
          disabled={disabled}
        />

        <Field
          name={`customer.${FIELDS.PHONE}`}
          component={InputField}
          hint={t('customers.phone')}
          onSubmitEditing={() => customerRefs.website.focus()}
          keyboardType={keyboardType.PHONE}
          refLinkFn={ref => (customerRefs.phone = ref)}
          disabled={disabled}
        />

        <Field
          name={`customer.${FIELDS.WEBSITE}`}
          component={InputField}
          hint={t('customers.website')}
          keyboardType={keyboardType.URL}
          refLinkFn={ref => (customerRefs.website = ref)}
          disabled={disabled}
        />

        <View style={styles.inputGroup}>
          <Field
            name={`customer.${FIELDS.CURRENCY}`}
            currencies={currencies}
            component={CurrencySelectModal}
            onSelect={val =>
              this.setFormField(`customer.${FIELDS.CURRENCY}`, val.id)
            }
            theme={theme}
            disabled={disabled}
            baseSelectProps={{rightIcon: 'angle-right'}}
          />

          <Field
            name={`customer.${FIELDS.BILLING}`}
            component={AddressContainer}
            hasBillingAddress
            addressValue={billingAddress}
            icon="map-marker-alt"
            rightIcon="angle-right"
            placeholder={t('customers.billing_address')}
            navigation={navigation}
            onChangeCallback={val =>
              this.setFormField(`customer.${FIELDS.BILLING}`, val)
            }
            containerStyle={styles.addressField}
            type={type}
            baseSelectProps={{
              color: isAddress(billingAddress) ? colors.primaryLight : null
            }}
            theme={theme}
            mainContainerStyle={theme?.mode === 'dark' && styles.line(theme)}
            disabled={disabled}
          />

          <Field
            name={`customer.${FIELDS.SHIPPING}`}
            component={AddressContainer}
            addressValue={shippingAddress}
            autoFillValue={billingAddress}
            icon="map-marker-alt"
            rightIcon="angle-right"
            placeholder={t('customers.shipping_address')}
            navigation={navigation}
            onChangeCallback={val =>
              this.setFormField(`customer.${FIELDS.SHIPPING}`, val)
            }
            containerStyle={styles.addressField}
            type={type}
            baseSelectProps={{
              color: isAddress(shippingAddress) ? colors.primaryLight : null
            }}
            theme={theme}
            disabled={disabled}
          />
        </View>

        {hasCustomField && <CustomField {...this.props} type="customer" />}
      </DefaultLayout>
    );
  }
}
