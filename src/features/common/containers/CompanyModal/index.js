import { connect } from 'react-redux';
import { Modal } from '../../components/CompanyModal';
import * as action from '../../actions';

const mapStateToProps = ({ global }) => ({
    company: global?.company,
    theme: global?.theme
});

const mapDispatchToProps = {
    login: action.getCompanies
};

const CompanyModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);

export default CompanyModal;
