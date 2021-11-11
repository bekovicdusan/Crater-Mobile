import t from 'locales/use-translation';
import {routes} from '@/navigation';
import {AssetImage} from '@/components';

export const emptyContentPlaceholder = props => {
  const {route, search, navigation, isFilter} = props;
  switch (route?.name) {
    case routes.CATEGORIES:
      return {
        title: t('search.no_result', {search}),
        ...(!search && {
          title: t('categories.empty.title'),
          description: t('categories.empty.description'),
          buttonTitle: t('categories.empty.button_title'),
          buttonPress: () =>
            navigation.navigate(routes.CREATE_CATEGORY, {type: 'ADD'})
        })
      };

    case routes.USERS:
      return {
        title: t('search.no_result', {search}),
        ...(!search && {
          title: t('users.empty.title'),
          description: t('users.empty.description'),
          buttonTitle: t('users.add_new_user'),
          buttonPress: () =>
            navigation.navigate(routes.CREATE_USER, {type: 'ADD'})
        })
      };

    case routes.ROLES:
      return {
        title: t('search.no_result', {search}),
        ...(!search && {
          title: t('roles.empty.title'),
          description: t('roles.empty.description'),
          buttonTitle: t('roles.add_new_role'),
          buttonPress: () =>
            navigation.navigate(routes.CREATE_ROLE, {type: 'ADD'})
        })
      };

    case routes.NOTES:
      return {
        title: t('search.no_result', {search}),
        ...(!search && {
          title: t('notes.empty.title'),
          description: t('notes.empty.description'),
          buttonTitle: t('notes.empty.button_title'),
          buttonPress: () =>
            navigation.navigate(routes.CREATE_NOTE, {type: 'ADD'})
        })
      };

    case routes.PAYMENT_MODES:
      return {
        title: t('search.no_result', {search}),
        ...(!search && {
          title: t('payment_modes.empty.title'),
          description: t('payment_modes.empty.description')
        })
      };

    case routes.ITEM_UNITS:
      return {
        title: t('search.no_result', {search}),
        ...(!search && {
          title: t('item_units.empty.title'),
          description: t('item_units.empty.description')
        })
      };

    case routes.TAXES:
      return {
        title: t('search.no_result', {search}),
        ...(!search && {
          title: t('taxes.empty.title'),
          description: t('taxes.empty.description'),
          buttonTitle: t('taxes.empty.button_title'),
          buttonPress: () =>
            navigation.navigate(routes.CREATE_TAX, {type: 'ADD'})
        })
      };

    case routes.MAIN_CUSTOMERS:
      const emptyTitle = search
        ? 'search.no_result'
        : isFilter
        ? 'filter.empty.filter_title'
        : 'customers.empty.title';
      return {
        title: t(emptyTitle, {search}),
        image: AssetImage.images.empty_customers,
        ...(!search && {
          description: t('customers.empty.description')
        }),
        ...(!search &&
          !isFilter && {
            buttonTitle: t('customers.empty.button_title'),
            buttonPress: () => {
              navigation.navigate(routes.CREATE_CUSTOMER, {type: 'ADD'});
            }
          })
      };

    case routes.CUSTOM_FIELDS:
      return {
        title: t('search.no_result', {search}),
        ...(!search && {
          title: t('custom_fields.empty.title'),
          description: t('custom_fields.empty.description'),
          buttonTitle: t('custom_fields.empty.button_title'),
          buttonPress: () =>
            navigation.navigate(routes.CREATE_CUSTOM_FIELD, {type: 'ADD'})
        })
      };

    default:
      return {
        title: props?.title,
        description: props?.description,
        image: props?.image,
        buttonTitle: props?.buttonTitle,
        buttonPress: props?.buttonPress
      };
  }
};
