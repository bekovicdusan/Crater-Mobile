import React from 'react';
import {Field, change} from 'redux-form';
import moment from 'moment';
import styles from './styles';
import {routes} from '@/navigation';
import t from 'locales/use-translation';
import * as Linking from 'expo-linking';
import {alertMe, isEmpty, MAX_LENGTH} from '@/constants';
import {IMAGES} from '@/assets';
import {
  InputField,
  DefaultLayout,
  FilePicker,
  DatePickerField,
  SelectField,
  CustomField,
  ActionButton
} from '@/components';
import {
  EXPENSE_FORM,
  EXPENSE_ACTIONS,
  ACTIONS_VALUE,
  EXPENSE_FIELDS as FIELDS
} from '../../constants';
import {getApiFormattedCustomFields} from '@/utils';
import _ from 'lodash';

interface IProps {
  navigation: any;
  type: string;
  id: number;
  getExpenseDetail: Function;
  createExpense: Function;
  updateExpense: Function;
  removeExpense: Function;
  dispatch: Function;
  loading: boolean;
  endpointURL: string;
  handleSubmit: Function;
  categories: Array<any>;
  customers: Array<any>;
  getCategories: Function;
  getCustomers: Function;
  customFields: Array<any>;
  formValues: any;
}

interface IState {
  attachmentReceipt: any;
  isLoading: boolean;
  imageUrl: string;
  fileLoading: boolean;
  fileType: string;
}

export class Expense extends React.Component<IProps, IState> {
  customerReference: any;
  categoryReference: any;

  constructor(props) {
    super(props);
    this.customerReference = React.createRef();
    this.categoryReference = React.createRef();

    this.state = {
      attachmentReceipt: null,
      isLoading: true,
      imageUrl: null,
      fileLoading: false,
      fileType: null
    };
  }

  componentDidMount() {
    this.setInitialValues();
  }

  setInitialValues = () => {
    const {
      getCreateExpense,
      getExpenseDetail,
      isEditScreen,
      isCreateScreen,
      id
    } = this.props;

    if (isCreateScreen) {
      getCreateExpense({
        onSuccess: () => {
          this.setFormField(`expense.${FIELDS.DATE}`, moment());
          this.setState({isLoading: false});
        }
      });
      return;
    }

    if (isEditScreen) {
      getExpenseDetail({
        id,
        onSuccess: (res, receipt) => {
          this.setFormField(`expense`, res);
          this.setState({
            imageUrl: receipt?.image,
            fileType: receipt?.type,
            isLoading: false
          });
          return;
        }
      });
    }
  };

  setFormField = (field, value) => {
    this.props.dispatch(change(EXPENSE_FORM, field, value));
  };

  onSubmit = values => {
    let params = values?.expense;

    for (const key in values?.expense) {
      params[key] = values?.expense[key] ?? '';
    }
    if (values?.customFields) {
      params = {
        ...params,
        customFields: getApiFormattedCustomFields(values?.customFields)
      };
    } else {
      params = _.omit(params, ['customFields']);
    }
    const {
      createExpense,
      navigation,
      updateExpense,
      isEditScreen,
      isCreateScreen,
      id
    } = this.props;

    const {attachmentReceipt, fileLoading, isLoading} = this.state;

    if (fileLoading || isLoading) {
      return;
    }

    if (isCreateScreen) {
      createExpense({
        params,
        attachmentReceipt,
        navigation
      });
      return;
    }

    if (isEditScreen) {
      updateExpense({
        id,
        params,
        attachmentReceipt,
        navigation
      });
      return;
    }
  };

  removeExpense = () => {
    const {removeExpense, navigation, route} = this.props;

    alertMe({
      title: t('alert.title'),
      desc: t('expenses.alertDescription'),
      showCancel: true,
      okPress: () =>
        removeExpense({
          id: route?.params?.id,
          navigation
        })
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
    navigation.navigate(routes.CUSTOMER, {
      type: 'ADD',
      onSelect: item => {
        this.setFormField(`expense.${FIELDS.CUSTOMER}`, item.id);
        this.customerReference?.changeDisplayValue?.(item);
      }
    });
  };

  navigateToCategory = () => {
    const {navigation} = this.props;
    navigation.navigate(routes.CATEGORY, {
      type: 'ADD',
      onSelect: item => {
        this.setFormField(`expense.${FIELDS.CATEGORY}`, item.id);
        this.categoryReference?.changeDisplayValue?.(item);
      }
    });
  };

  render() {
    const {
      navigation,
      handleSubmit,
      categories,
      getCategories,
      type,
      getCustomers,
      customers,
      customFields,
      formValues,
      currency,
      isEditScreen,
      isAllowToEdit,
      isAllowToDelete,
      isCreateScreen,
      loading
    } = this.props;
    const disabled = !isAllowToEdit;

    const {imageUrl, isLoading, fileLoading, fileType} = this.state;

    const isCreateExpense = isCreateScreen;
    const hasCustomField = isEditScreen
      ? formValues?.expense && formValues.expense.hasOwnProperty('fields')
      : !isEmpty(customFields);

    const drownDownProps =
      !isCreateExpense && !isLoading
        ? {
            options: EXPENSE_ACTIONS(imageUrl, isAllowToDelete),
            onSelect: this.onOptionSelect,
            cancelButtonIndex: 1,
            destructiveButtonIndex: 2,
            ...(imageUrl && {
              cancelButtonIndex: 2,
              destructiveButtonIndex: 1
            }),
            ...(!isAllowToDelete && {
              cancelButtonIndex: 1,
              destructiveButtonIndex: 2
            })
          }
        : null;

    const getTitle = () => {
      let title = 'header.addExpense';
      if (isEditScreen && !isAllowToEdit) title = 'header.viewExpense';
      if (isEditScreen && isAllowToEdit) title = 'header.editExpense';

      return t(title);
    };

    const headerProps = {
      leftIconPress: () => navigation.goBack(null),
      title: getTitle(),
      placement: 'center',
      ...(!isEditScreen && {
        rightIcon: 'save',
        rightIconProps: {solid: true},
        rightIconPress: handleSubmit(this.onSubmit)
      })
    };

    const bottomAction = [
      {
        label: 'button.save',
        onPress: handleSubmit(this.onSubmit),
        loading: loading || fileLoading || isLoading,
        show: isAllowToEdit
      }
    ];

    return (
      <DefaultLayout
        headerProps={headerProps}
        loadingProps={{is: isLoading}}
        dropdownProps={drownDownProps}
        bottomAction={<ActionButton buttons={bottomAction} />}
      >
        <Field
          name={`expense.${FIELDS.RECEIPT}`}
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
          name={`expense.${FIELDS.DATE}`}
          component={DatePickerField}
          isRequired
          label={t('expenses.date')}
          icon={'calendar-alt'}
          disabled={disabled}
        />

        <Field
          name={`expense.${FIELDS.AMOUNT}`}
          component={InputField}
          isRequired
          leftSymbol={currency?.symbol}
          hint={t('expenses.amount')}
          disabled={disabled}
          inputProps={{
            returnKeyType: 'go',
            keyboardType: 'decimal-pad'
          }}
          isCurrencyInput
        />

        <Field
          name={`expense.${FIELDS.CATEGORY}`}
          component={SelectField}
          isRequired
          apiSearch
          hasPagination
          getItems={getCategories}
          items={categories}
          displayName="name"
          label={t('expenses.category')}
          icon="align-center"
          placeholder={t('expenses.categoryPlaceholder')}
          compareField="id"
          onSelect={item =>
            this.setFormField(`expense.${FIELDS.CATEGORY}`, item.id)
          }
          rightIconPress={this.navigateToCategory}
          createActionRouteName={routes.CATEGORIES}
          headerProps={{
            title: t('expenses.categoryPlaceholder')
          }}
          emptyContentProps={{contentType: 'categories'}}
          reference={ref => (this.categoryReference = ref)}
          isEditable={!disabled}
          fakeInputProps={{disabled}}
        />

        <Field
          name={`expense.${FIELDS.CUSTOMER}`}
          component={SelectField}
          apiSearch
          hasPagination
          getItems={getCustomers}
          items={customers}
          displayName="name"
          label={t('payments.customer')}
          icon="user"
          placeholder={t('customers.placeholder')}
          compareField="id"
          onSelect={item =>
            this.setFormField(`expense.${FIELDS.CUSTOMER}`, item.id)
          }
          rightIconPress={this.navigateToCustomer}
          createActionRouteName={routes.MAIN_CUSTOMERS}
          headerProps={{
            title: t('customers.title')
          }}
          emptyContentProps={{
            contentType: 'customers',
            image: IMAGES.EMPTY_CUSTOMERS
          }}
          reference={ref => (this.customerReference = ref)}
          isEditable={!disabled}
          fakeInputProps={{disabled}}
        />

        <Field
          name={`expense.${FIELDS.NOTES}`}
          component={InputField}
          hint={t('expenses.notes')}
          inputProps={{
            returnKeyType: 'next',
            placeholder: t('expenses.notesPlaceholder'),
            autoCorrect: true,
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
