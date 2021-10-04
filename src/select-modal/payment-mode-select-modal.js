import React from 'react';
import {SelectField} from '@/components';
import t from 'locales/use-translation';
import {routes} from '@/navigation';

interface IProps {
  /**
   * An array of objects with data for each payment-mode.
   */
  paymentModes?: Array<any>;

  /**
   * An action to return a list of payment-mode.
   */
  fetchPaymentModes?: () => void;

  /**
   * Is allowed to edit.
   */
  disabled?: Boolean;
}

export const PaymentModeSelectModal = (props: IProps) => {
  const {paymentModes, fetchPaymentModes, disabled} = props;

  return (
    <SelectField
      {...props}
      items={paymentModes ?? []}
      apiSearch
      hasPagination
      getItems={fetchPaymentModes}
      displayName="name"
      label={t('payments.mode')}
      icon="align-center"
      placeholder={t('payments.modePlaceholder')}
      compareField="id"
      headerProps={{title: t('payments.modePlaceholder')}}
      emptyContentProps={{contentType: 'paymentMode'}}
      inputModalName="PaymentModeModal"
      createActionRouteName={routes.PAYMENT_MODES}
      isEditable={!disabled}
      fakeInputProps={{disabled}}
    />
  );
};
