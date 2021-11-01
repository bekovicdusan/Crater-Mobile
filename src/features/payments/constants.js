import {routes} from '@/navigation';
import {PermissionService} from '@/services';
import t from 'locales/use-translation';

// Forms
// -----------------------------------------
export const PAYMENT_SEARCH = 'payments/PAYMENT_SEARCH';
export const PAYMENT_FORM = 'payments/PAYMENT_FORM';

// Types
// -----------------------------------------
export const GET_PAYMENTS = 'payments/GET_PAYMENTS';
export const SET_PAYMENTS = 'payments/SET_PAYMENTS';

export const GET_CREATE_PAYMENT = 'payments/GET_CREATE_PAYMENT';
export const CREATE_PAYMENT = 'payments/CREATE_PAYMENT';
export const PAYMENTS_TRIGGER_SPINNER = 'payments/PAYMENTS_TRIGGER_SPINNER';
export const GET_PAYMENT_DETAIL = 'payments/GET_PAYMENT_DETAIL';
export const UPDATE_PAYMENT = 'payments/UPDATE_PAYMENT';
export const REMOVE_PAYMENT = 'payments/REMOVE_PAYMENT';
export const SEND_PAYMENT_RECEIPT = 'payments/SEND_PAYMENT_RECEIPT';
export const GET_UNPAID_INVOICES = 'payments/GET_UNPAID_INVOICES';
export const SAVE_UNPAID_INVOICES = 'payments/SAVE_UNPAID_INVOICES';

export const CREATE_FROM_PAYMENTS = 'payments/CREATE_FROM_PAYMENTS';
export const REMOVE_FROM_PAYMENTS = 'payments/REMOVE_FROM_PAYMENTS';
export const UPDATE_FROM_PAYMENTS = 'payments/UPDATE_FROM_PAYMENTS';

export const ACTIONS_VALUE = {
  SEND: 'send',
  REMOVE: 'remove'
};

export const PAYMENT_ACTIONS = isAllowToDelete => {
  const options = [];

  if (PermissionService.isAllowToSend(routes.PAYMENT)) {
    options.push({
      label: t('payments.send_receipt'),
      value: ACTIONS_VALUE.SEND
    });
  }

  if (isAllowToDelete) {
    options.push({
      label: t('payments.remove_payment'),
      value: ACTIONS_VALUE.REMOVE
    });
  }

  return options;
};

// Expense Fields
// -----------------------------------------
export const PAYMENT_FIELDS = {
  DATE: 'payment_date',
  NUMBER: 'payment_number',
  PAYMENT_NO: 'payment_no',
  CUSTOMER: 'customer_id',
  INVOICE: 'invoice_id',
  AMOUNT: 'amount',
  METHOD: 'payment_method_id',
  NOTES: 'notes',
  PREFIX: 'prefix'
};
