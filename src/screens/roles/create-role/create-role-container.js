import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import CreateRole from './create-role';
import {CREATE_ROLE_FORM} from 'stores/role/types';
import {validate} from 'stores/role/validator';
import {commonSelector, permissionSelector} from 'stores/common/selectors';
import {
  formattedPermissionsSelector,
  permissionsSelector,
  loadingSelector
} from 'stores/role/selectors';

const mapStateToProps = (state, {route}) => ({
  permissions: permissionsSelector(state),
  formattedPermissions: formattedPermissionsSelector(state),
  initialValues: {name: ''},
  ...commonSelector(state),
  ...permissionSelector(route),
  ...loadingSelector(state)
});

const CreateRoleForm = reduxForm({form: CREATE_ROLE_FORM, validate})(
  CreateRole
);

export const CreateRoleContainer: any = connect(mapStateToProps)(
  CreateRoleForm
);
