import {createSelector} from 'reselect';
import {capitalize, isEmpty} from '@/constants';
import {BADGE_STATUS_BG_COLOR, BADGE_STATUS_TEXT_COLOR} from '@/utils';

const paymentStore = state => state?.payment;

export const paymentsSelector = createSelector(
  paymentStore,
  store => {
    if (isEmpty(store?.payments)) return [];
    return store.payments.map(payment => {
      const {
        formattedPaymentDate,
        amount,
        payment_mode,
        customer: {name},
        currency
      } = payment;

      return {
        title: `${name}`,
        subtitle: {title: `${payment_mode ? '(' + payment_mode + ')' : ''}`},
        amount,
        currency,
        rightSubtitle: formattedPaymentDate,
        fullItem: payment
      };
    });
  }
);

export const unPaidInvoicesSelector = createSelector(
  state => state.payment.unPaidInvoices,
  state => state.common.theme,
  (unPaidInvoices, theme) => {
    if (isEmpty(unPaidInvoices)) return [];

    return unPaidInvoices.map(invoice => {
      const {
        status,
        invoice_number,
        formattedDueDate,
        due_amount,
        customer
      } = invoice;

      return {
        title: customer?.name,
        subtitle: {
          title: invoice_number,
          labelTextColor: BADGE_STATUS_TEXT_COLOR?.[status]?.[theme.mode],
          ...(theme.mode === 'dark'
            ? {
                label: capitalize(status),
                labelOutlineColor: BADGE_STATUS_BG_COLOR?.[status]?.[theme.mode]
              }
            : {
                label: status,
                labelBgColor: BADGE_STATUS_BG_COLOR?.[status]?.[theme.mode]
              })
        },
        amount: due_amount,
        currency: customer?.currency,
        rightSubtitle: formattedDueDate,
        fullItem: invoice
      };
    });
  }
);

export const loadingSelector = createSelector(
  paymentStore,
  store => ({isSaving: store?.isSaving, isDeleting: store?.isDeleting})
);
