import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {groupBy} from 'lodash';
import Role from './role';
import {ROLE_FORM} from 'modules/roles/constants';
import {validateRole} from 'modules/roles/validator';
import {permissionSelector} from 'modules/common/selectors';

const mapStateToProps = ({roles, global}, {navigation}) => {
  const role = navigation.getParam('role', {});
  return {
    permissions: roles?.permissions,
    formattedPermissions: groupBy(roles?.permissions ?? [], 'modelName'),
    loading: roles?.loading?.roleLoading,
    roleId: role?.id,
    locale: global?.locale,
    theme: global?.theme,
    ...permissionSelector(navigation),
    initialValues: {
      name: ''
    }
  };
};

const RoleForm = reduxForm({
  form: ROLE_FORM,
  validate: validateRole
})(Role);

const RoleContainer: any = connect(mapStateToProps)(RoleForm);

RoleContainer.navigationOptions = () => ({
  header: null
});

export default RoleContainer;
