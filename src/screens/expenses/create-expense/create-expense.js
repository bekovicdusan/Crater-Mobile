import React from 'react';
import _ from 'lodash';
import * as Linking from 'expo-linking';
import {Field, change, initialize} from 'redux-form';
import t from 'locales/use-translation';
import styles from './create-expense-styles';
import {dismissRoute, routes} from '@/navigation';
import {alertMe, isEmpty, MAX_LENGTH} from '@/constants';
import {keyboardType} from '@/helpers/keyboard';
import {CREATE_EXPENSE_FORM} from 'stores/expense/types';
import {EXPENSE_ACTIONS, ACTIONS_VALUE} from 'stores/expense/helpers';
import {getApiFormattedCustomFields} from '@/utils';
import {CustomerSelectModal, ExpenseCategorySelectModal} from '@/select-modal';
import {IProps, IState} from './create-expense-type';
import {
  addExpense,
  fetchExpenseInitialDetails,
  fetchSingleExpense,
  removeExpense,
  updateExpense
} from 'stores/expense/actions';
import {
  BaseInput,
  DefaultLayout,
  FilePicker,
  BaseDatePicker,
  CustomField,
  BaseButtonGroup,
  BaseButton
} from '@/components';

export default class CreateExpense extends React.Component<IProps, IState> {
  customerReference: any;
  categoryReference: any;

  constructor(props) {
    super(props);
    this.customerReference = React.createRef();
    this.categoryReference = React.createRef();

    this.state = {
      isFetchingInitialData: true,
      attachmentReceipt: null,
      imageUrl: null,
      fileLoading: false,
      customer: null,
      fileType: null
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const {isEditScreen, id, dispatch} = this.props;
    if (isEditScreen) {
      dispatch(
        fetchSingleExpense(id, (res, receipt) =>
          this.setInitialData(res, receipt)
        )
      );
      return;
    }
    dispatch(fetchExpenseInitialDetails(() => this.setInitialData(null)));
    return;
  };

  setInitialData = res => {
    const {dispatch, route} = this.props;
    const customer = route?.params?.customer;
    if (res) {
      dispatch(initialize(CREATE_EXPENSE_FORM, res));
      if (res?.attachment_receipt_url) {
        this.setState({
          imageUrl: res?.attachment_receipt_url?.url,
          fileType: res?.attachment_receipt_url?.type,
          customer: res?.customer
        });
      }
    }

    if (customer) {
      this.setFormField('customer_id', customer.id);
      this.setState({customer});
    }

    this.setState({isFetchingInitialData: false});
  };

  setFormField = (field, value) => {
    this.props.dispatch(change(CREATE_EXPENSE_FORM, field, value));
  };

  onSave = values => {
    const {isCreateScreen, id, isSaving, isDeleting, dispatch} = this.props;
    const {attachmentReceipt, isFetchingInitialData} = this.state;

    if (isSaving || isDeleting || isFetchingInitialData) {
      return;
    }

    const payload = {
      id,
      params: {
        ...values,
        customFields: getApiFormattedCustomFields(values?.customFields)
      },
      attachmentReceipt
    };
    isCreateScreen
      ? dispatch(addExpense(payload))
      : dispatch(updateExpense(payload));
  };

  removeExpense = () => {
    const {id, navigation, dispatch} = this.props;

    alertMe({
      title: t('alert.title'),
      desc: t('expenses.alert_description'),
      showCancel: true,
      okPress: () => dispatch(removeExpense(id, navigation))
    });
  };

  onOptionSelect = action => {
    const {endpointURL, id} = this.props;

    switch (action) {
      case ACTIONS_VALUE.REMOVE:
        return this.removeExpense();

      case ACTIONS_VALUE.DOWNLOAD:
        return Linking.openURL(`${endpointURL}/expenses/${id}/receipt`);

      default:
        break;
    }
  };

  navigateToCustomer = () => {
    const {navigation} = this.props;

    dismissRoute(routes.CREATE_CUSTOMER, () =>
      navigation.navigate(routes.CREATE_CUSTOMER, {
        type: 'ADD',
        onSelect: customer => {
          this.setState({customer});
          this.setFormField('customer_id', customer.id);
          this.customerReference?.changeDisplayValue?.(customer);
        }
      })
    );
  };

  navigateToCategory = () => {
    const {navigation} = this.props;
    navigation.navigate(routes.CREATE_CATEGORY, {
      type: 'ADD',
      onSelect: item => {
        this.setFormField('expense_category_id', item.id);
        this.categoryReference?.changeDisplayValue?.(item);
      }
    });
  };

  render() {
    const {
      navigation,
      handleSubmit,
      categories,
      fetchCategories,
      fetchCustomers,
      customers,
      customFields,
      formValues,
      isEditScreen,
      isAllowToEdit,
      isAllowToDelete,
      isCreateScreen,
      isSaving,
      isDeleting
    } = this.props;
    const {imageUrl, fileType, customer, isFetchingInitialData} = this.state;

    const categoryName = formValues?.expense_category?.name;
    const disabled = !isAllowToEdit;
    const isCreateExpense = isCreateScreen;
    const hasCustomField = isEditScreen
      ? formValues && formValues.hasOwnProperty('fields')
      : !isEmpty(customFields);

    const dropdownOptions =
      !isCreateExpense && !isFetchingInitialData
        ? EXPENSE_ACTIONS(imageUrl, isAllowToDelete)
        : [];

    const drownDownProps =
      !isCreateExpense && !isFetchingInitialData
        ? {
            options: dropdownOptions,
            onSelect: this.onOptionSelect,
            cancelButtonIndex: dropdownOptions.length,
            destructiveButtonIndex: dropdownOptions.length - 1,
            ...(!isAllowToDelete && {
              destructiveButtonIndex: dropdownOptions.length + 1
            })
          }
        : null;

    const getTitle = () => {
      let title = 'header.add_expense';
      if (isEditScreen && !isAllowToEdit) title = 'header.view_expense';
      if (isEditScreen && isAllowToEdit) title = 'header.edit_expense';

      return t(title);
    };

    const headerProps = {
      leftIconPress: () => navigation.goBack(null),
      title: getTitle(),
      placement: 'center',
      ...(!isEditScreen && {
        rightIcon: 'save',
        rightIconProps: {solid: true},
        rightIconPress: handleSubmit(this.onSave)
      })
    };

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
        dropdownProps={drownDownProps}
        bottomAction={bottomAction}
      >
        <Field
          name="attachment_receipt"
          component={FilePicker}
          withDocument
          label={t('expenses.receipt')}
          fileLoading={val => this.setState({fileLoading: val})}
          containerStyle={styles.filePicker}
          uploadedFileType={fileType}
          onChangeCallback={val => this.setState({attachmentReceipt: val})}
          uploadedFileUrl={
            fileType && fileType.includes('image') ? imageUrl : null
          }
          showUploadedImageAsCache={false}
          disabled={disabled}
        />

        <Field
          name="expense_date"
          component={BaseDatePicker}
          isRequired
          label={t('expenses.date')}
          icon={'calendar-alt'}
          disabled={disabled}
        />

        <Field
          name="amount"
          component={BaseInput}
          isRequired
          leftSymbol={customer?.currency?.symbol}
          hint={t('expenses.amount')}
          disabled={disabled}
          keyboardType={keyboardType.DECIMAL}
          isCurrencyInput
        />

        <Field
          name="expense_category_id"
          categories={categories}
          fetchCategories={fetchCategories}
          component={ExpenseCategorySelectModal}
          placeholder={
            categoryName ? categoryName : t('expenses.category_placeholder')
          }
          onSelect={item => this.setFormField('expense_category_id', item.id)}
          rightIconPress={this.navigateToCategory}
          reference={ref => (this.categoryReference = ref)}
          disabled={disabled}
        />

        <Field
          name="customer_id"
          component={CustomerSelectModal}
          fetchCustomers={fetchCustomers}
          placeholder={t('invoices.customer_placeholder')}
          selectedItem={customer}
          customers={customers}
          disabled={disabled}
          onSelect={customer => {
            this.setState({customer});
            this.setFormField('customer_id', customer.id);
          }}
          rightIconPress={this.navigateToCustomer}
          reference={ref => (this.customerReference = ref)}
          isRequired={false}
        />

        <Field
          name="notes"
          component={BaseInput}
          hint={t('expenses.notes')}
          placeholder={t('expenses.notes_placeholder')}
          inputProps={{
            multiline: true,
            maxLength: MAX_LENGTH
          }}
          disabled={disabled}
          height={80}
        />

        {hasCustomField && <CustomField {...this.props} type="expense" />}
      </DefaultLayout>
    );
  }
}
