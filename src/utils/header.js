import {routes} from '@/navigation';
import t from 'locales/use-translation';

export default params => {
  const {isEditScreen, isAllowToEdit} = params;
  const isUpdate = isEditScreen && isAllowToEdit;
  const isView = isEditScreen && !isAllowToEdit;

  function getTitle(addScreenTitle, updateScreenTitle, viewScreenTitle) {
    return isView
      ? t(viewScreenTitle)
      : isUpdate
      ? t(updateScreenTitle)
      : t(addScreenTitle);
  }

  switch (params?.route?.name) {
    case routes.CREATE_USER:
      return getTitle('header.addUser', 'header.editUser', 'header.viewUser');

    case routes.CREATE_RECURRING_INVOICE:
      return getTitle(
        'header.add_recurring_invoice',
        'header.edit_recurring_invoice',
        'header.view_recurring_invoice'
      );

    case routes.CREATE_ROLE:
      return getTitle('header.addRole', 'header.editRole', 'header.viewRole');

    case routes.CREATE_CATEGORY:
      return getTitle(
        'header.addCategory',
        'header.editCategory',
        'header.viewCategory'
      );

    default:
      return '';
  }
};
