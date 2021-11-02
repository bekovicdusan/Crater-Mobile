import {connect} from 'react-redux';
import LostConnection from './lost-connection';
import {commonSelector} from 'stores/common/selectors';

const mapStateToProps = state => ({
  ...commonSelector(state)
});

export const LostConnectionContainer = connect(mapStateToProps)(LostConnection);
