import t from 'locales/use-translation';
import {AssetImage} from '@/components';
import {PermissionService} from '@/services';
import {routes} from '@/navigation';

export default paymentsFilterFields = ({props, setFormField}) => {
  const {
    getCustomers,
    fetchPaymentModes,
    customers,
    navigation,
    paymentModes
  } = props;

  const selectFields = [
    PermissionService.isAllowToView(routes.MAIN_CUSTOMERS) && {
      name: 'customer_id',
      apiSearch: true,
      hasPagination: true,
      getItems: getCustomers,
      items: customers,
      displayName: 'name',
      label: t('payments.customer'),
      icon: 'user',
      placeholder: t('customers.placeholder'),
      navigation: navigation,
      compareField: 'id',
      onSelect: item => setFormField('customer_id', item.id),
      headerProps: {
        title: t('customers.title'),
        rightIconPress: null
      },
      emptyContentProps: {
        contentType: 'customers',
        image: AssetImage.images.empty_customers
      }
    },
    {
      name: 'payment_method_id',
      apiSearch: true,
      hasPagination: true,
      getItems: fetchPaymentModes,
      items: paymentModes,
      displayName: 'name',
      label: t('payments.mode'),
      icon: 'align-center',
      placeholder: t('payments.modePlaceholder'),
      navigation: navigation,
      compareField: 'id',
      onSelect: item => setFormField('payment_method_id', item.id),
      headerProps: {
        title: t('payments.modePlaceholder'),
        rightIconPress: null
      },
      listViewProps: {hasAvatar: true},
      emptyContentProps: {
        contentType: 'paymentMode'
      }
    }
  ];

  const inputFields = [
    {
      name: 'payment_number',
      hint: t('payments.number'),
      leftIcon: 'hashtag'
    }
  ];

  return {selectFields, inputFields};
};
