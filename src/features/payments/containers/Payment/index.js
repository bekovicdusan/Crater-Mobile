import {connect} from 'react-redux';
import {reduxForm, getFormValues} from 'redux-form';
import {validate} from './validation';
import * as actions from '../../actions';
import {PAYMENT_FORM, PAYMENT_FIELDS as FIELDS} from '../../constants';
import {Payment} from '../../components/Payment';
import {getCustomers} from '@/features/customers/actions';
import {fetchPaymentModes} from 'stores/payment-modes/actions';
import {getPaymentModesState} from '../../selectors';
import {commonSelector, permissionSelector} from 'stores/common/selectors';
import {currentCurrencySelector} from 'stores/company/selectors';
import {fetchNotes} from 'stores/notes/actions';
import {notesSelector} from 'stores/notes/selectors';

const mapStateToProps = (state, {route}) => {
  const {
    customers: {customers},
    settings: {customFields},
    payments: {loading, unPaidInvoices},
    paymentModes: {modes}
  } = state;

  const invoice = route?.params?.invoice;
  const hasRecordPayment = route?.params?.hasRecordPayment;

  return {
    customers,
    invoice,
    notes: notesSelector(state),
    hasRecordPayment,
    loading: loading?.paymentLoading,
    withLoading: loading?.sendReceiptLoading,
    unPaidInvoices,
    customFields,
    paymentModes: getPaymentModesState(modes),
    formValues: getFormValues(PAYMENT_FORM)(state) || {},
    currency: currentCurrencySelector(state),
    ...permissionSelector(route),
    ...commonSelector(state),
    initialValues: {
      payment: {
        [FIELDS.CUSTOMER]: null,
        [FIELDS.INVOICE]: null,
        [FIELDS.METHOD]: null,
        [FIELDS.NOTES]: null
      }
    }
  };
};

const mapDispatchToProps = {
  ...actions,
  getCustomers,
  fetchPaymentModes,
  fetchNotes
};

const paymentReduxForm = reduxForm({
  form: 'payments/PAYMENT_FORM',
  validate
})(Payment);

const PaymentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(paymentReduxForm);

export default PaymentContainer;
